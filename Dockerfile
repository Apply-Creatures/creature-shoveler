# Use an official Node.js runtime as a parent image
FROM node:18-alpine AS creature-shoveler

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./
COPY package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the internal port listened by the application
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]