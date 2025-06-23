FROM node:18-slim

RUN apt-get update && apt-get install -y ca-certificates && update-ca-certificates

# Create app directory
WORKDIR /usr/src/app

# Bundle app source
COPY package*.json ./
COPY tsconfig.json ./
COPY ./src ./src

RUN npm install @dittolive/ditto

# Install app dependencies
RUN npm install

# Compile typescript application
RUN npm run build

# Expose port for webui
EXPOSE 3000

# Start server
CMD [ "npm", "start"]