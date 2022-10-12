FROM node:18-slim
# Create app directory
WORKDIR /usr/src/app

# Bundle app source
COPY package*.json ./
COPY tsconfig.json ./
COPY ./src ./src

# Install app dependencies
RUN npm install

# Compile typescript application
RUN npm run build

# Expose port for webui
EXPOSE 3000

# Start server
CMD [ "node", "build/server.js"]