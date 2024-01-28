FROM node:16
WORKDIR /usr/src/app

RUN npm install -g pnpm

# Bundle your app source
COPY . .
RUN pnpm install


# Expose the port your app runs on
EXPOSE 3000

# Define the command to run your app
CMD ["pnpm", "dev"]