FROM  node:0.12


ENV PARSE_APP_KEY=gp5pTelFu2HAZb4JQcrNVhLVAjmTwn7ysUF8ySSe
ENV PARSE_JS_KEY=sHWp3LeeMD4FARjm6eVpAsft8lO7Wxa4lNM8Vaw6
ENV PARSE_REST_KEY=GM9jnkdWHxGxhhUxSZ6NsiqVwSAI9iybJmgX2DIm
ENV PARSE_MASTER_KEY=4DHToK3rkfQM6CqijZgCu4K4GShIy8LfnxlykWM6
ENV FACEBOOK_APP_ID=538863569471826
ENV FACEBOOK_APP_SECRET=64b46a019be801722e5537a37c7ebc5a

# Install nodemon
RUN npm install -g nodemon grunt-cli

EXPOSE 3000

# Provides cached layer for node_modules
#?? ADD package.json /tmp/package.json
#?? RUN cd /tmp && npm install
#?? RUN mkdir -p /src && cp -a /tmp/node_modules /src/
RUN mkdir -p /app

# Define working directory
WORKDIR /app

COPY . /app/
WORKDIR /app
RUN ["npm", "install"]
# RUN apt-get update \
  # && apt-get dist-upgrade -y

# Overridable Command
ENV DEBUG=*
ENTRYPOINT ["nodemon", "index"]
