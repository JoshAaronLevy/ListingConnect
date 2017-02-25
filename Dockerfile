FROM node:5.10.1

MAINTAINER Dan Levy <Dan@DanLevy.net>

EXPOSE 3000

COPY . /app/

WORKDIR /app

# RUN ["npm", "i"]
ADD https://raw.githubusercontent.com/justsml/system-setup-tools/master/home-scripts/.bashrc /root/.bashrc
ADD https://raw.githubusercontent.com/justsml/system-setup-tools/master/home-scripts/.bash_aliases /root/.bash_aliases

# RUN ["npm", "install"]

CMD ["npm", "start"]
# CMD ["./node_modules/.bin/nodemon", "index.js"]

