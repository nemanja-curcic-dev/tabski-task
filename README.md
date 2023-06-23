# Tabski Task

## Project Description
### Example GraphQL API for CRUD operations on Users and Posts

## Set up and running
### Prerequisites
* Recommended Node v16.16.0 and above
* git - for cloning the repository
* Docker
* Docker Compose

### Running
* After cloning the repository
* From the root of the project to start the service run
`docker-compose up`
* For stopping the service run 
`docker-compose stop`
* To remove the resources associated with the service (networks and containers) 
`docker-compose down`
* To remove the volumes also run
`docker-compose down -v`
* Service can also be run locally (in that case running postgres database server must be present and environment variable DATABASE_URL set accordingly)

### Testing
* After installing dependencies with
`npm install`
* Run command
`npm run test`
* Be sure to run Node version v16.16.0 and above (for previous ones it may not work)

### Accessing the API
* The api can be accessed on http://localhost:4000/graphql