#!/bin/bash
APP_NAME=touchevent
WWW=/var/www/$APP_NAME
API=/var/node/$APP_NAME
USER=node
ADMIN_USERNAME=admin
ADMIN_PASSWORD=touchevent
SERVER_HOST=172.26.6.2:8080

setup_build_tools(){
	sudo apt-get update
	sudo apt-get install -y build-essential
	sudo apt-get install -y libkrb5-dev
	sudo apt-get install -y git
	sudo apt-get install -y apache2-utils
}

setup_node_js(){
	curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
	sudo apt-get install -y nodejs
}

setup_mongo_db(){
	sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927
	echo "deb http://repo.mongodb.org/apt/ubuntu precise/mongodb-org/3.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.2.list
	sudo apt-get update
	sudo apt-get install -y mongodb-org
	sudo cp ./disable-transparent-hugepages /etc/init.d
	sudo chmod 755 /etc/init.d/disable-transparent-hugepages
	sudo update-rc.d disable-transparent-hugepages defaults
	sudo service disable-transparent-hugepages start
	sudo service mongod start
}

setup_nginx(){
	sudo apt-get install -y nginx
	sed -i -e "s/<APP_NAME>/${APP_NAME}/" ./default
	sudo cp ./default /etc/nginx/sites-enabled/default
	sudo service nginx reload
}

install_files(){
	sed -i -e "s/<SERVER_HOST>/${SERVER_HOST}/" ./client/app/config/cfg.json
	SECRET=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 32 | head -n 1)
	sed -i -e "s/<APP_NAME>/${APP_NAME}/" -e "s/<SECRET>/${SECRET}/" ./server/app/cfg.js
	if [ ! -d "$WWW" ]; then
		sudo mkdir -p "$WWW"
	fi
	sudo cp -r ./client/app/* "$WWW"
	if [ ! -d "$API" ]; then
		sudo mkdir -p "$API"
	fi
	sudo cp -r ./server/* "$API"
}

setup_server() {
	sudo npm install -g pm2
	sudo adduser --disabled-password --gecos "api server user" $USER
	sudo pm2 startup ubuntu -u $USER
	sudo cp ./pm2-init.sh /etc/init.d/
	sudo chmod 755 /etc/init.d/pm2-init.sh
	sudo chown -R "$USER" "$API"
	sudo chown -R "$USER" "$WWW"
	cd "$API"
	if [ -d node_modules ]; then
		rm -rf node_modules
	fi
	sudo su $USER -c "npm install --no-bin-links"
	HASH=$(echo "$ADMIN_PASSWORD" \
		| htpasswd -n -i -B -C 10 username  \
		| tr -d '\n' \
		| awk -F: '{ print $2 }')
    DB_COMMAND='db.users.insert({username:"'
	DB_COMMAND+=$ADMIN_USERNAME
	DB_COMMAND+='",password:"'
	DB_COMMAND+=$HASH
	DB_COMMAND+='", registered_at: new Date()})'
	export LC_ALL=C
	echo && echo "Mongodb command: $DB_COMMAND"
	mongo $APP_NAME --eval "$DB_COMMAND"
}

startup_server(){
	sudo su $USER -c "pm2 start $API/app/server.js"
	sudo su $USER -c "pm2 save"
}

main() {
	sudo echo && echo "setting up build tools" 
	setup_build_tools
	echo && echo "setting up node.js 4.2.4"
	setup_node_js
	echo && echo "setting up mongodb 3.2.1"
	setup_mongo_db
	echo && echo "setting up nginx web server 1.4.6..."
	setup_nginx
	echo && echo "installing server and client files"
	install_files
	echo && echo "setting up server dependencies and startup"
	setup_server
	echo && echo "starting server"
	startup_server
	echo && echo "exiting installation script"
	exit 0
}

main


