FROM node:16
# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY ./build/ /usr/src/app/build
COPY ./src/index.html /usr/src/app/build/index.html

# Expose port for webui
EXPOSE 3000

# Start server
CMD [ "node", "build/server.js"]