# Base image
FROM node:22

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source files
COPY . .

# Run tests
RUN npm test

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]