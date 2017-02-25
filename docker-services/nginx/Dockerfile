# Set nginx base image
FROM nginx

# File Author / Maintainer
MAINTAINER Dan Levy <Dan@DanLevy.net>
# Copy custom configuration file from the current directory
COPY nginx.conf /etc/nginx/

EXPOSE 80
EXPOSE 443

ADD https://raw.githubusercontent.com/justsml/system-setup-tools/master/home-scripts/.bashrc /root/.bashrc
ADD https://raw.githubusercontent.com/justsml/system-setup-tools/master/home-scripts/.bash_aliases /root/.bash_aliases

# RUN groupadd -r mongodb && useradd -r -g mongodb mongodb
# USER mongodb
