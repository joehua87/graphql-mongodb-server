FROM joehua/buzz-node

WORKDIR /opt/app

COPY .docker /tmp

# Copy cache contents (if any) from local machine
ADD .yarn-cache.tgz /

# Install packages
RUN cd /tmp && yarn install --production
RUN mkdir -p /opt/app && cd /opt/app && ln -s /tmp/node_modules

# Copy the code
COPY package.json /opt/app
COPY lib /opt/app/lib
