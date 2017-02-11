# Dev-Test


#Requirements
node 6.0^
npm 4.0^
Mongo 3.2.4

1. `npm i angular-cli -g`
2. `npm i`

## Run 
1. Terminal window 1: `mongod`: run MongoDB
2. Terminal window 2: `npm run be`: run Backend server
3. Terminal window 3: `npm start`: run Angular frontend
4. Browser will automatically open to: [localhost:4200](http://localhost:4200)

## Docker
// For some reason my server can't access the mongo db the way I had it. So currently the image doesn't work

1. Create Mongo container: `docker run --name db -d mongo`

2. Create app container: `docker-compose up`