
build:

	docker build -t lc-api .

start:

	docker run --rm -it --name proxy1 -p '3000:3000' lc-api bash

dev:

	docker run --rm -it -v ~/apps/node/beacon-proxy:/app --name api-proxy -p '3000:3000' lc-api .

daemon:

	docker run -it --name api-proxy -p '3000:3000' lc-api .

install:

	sudo npm install -g protractor mocha grunt-cli bower nodemon browserify
	npm install
	bower install

.PHONY: install
