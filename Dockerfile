# Use the official Node.js image as a base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Expose the port that the app runs on
EXPOSE 3000

# Run the dist:api script
# Command to run the app
CMD ["npm", "run", "dist:api"]
