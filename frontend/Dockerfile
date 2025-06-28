# Use a Node.js image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Expose the port that React Development Server runs on (default is 3000)
EXPOSE 3000

# Command to start the React development server
CMD ["npm", "start"]