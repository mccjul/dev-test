# Dev-Test
The upload and download of the test gave me serious bugs that I couldn't figure out. I will quite honest in saying that I do not have any experience in file upload and download in node. 
Given that I figured out how to upload some files and download some files on the current configuration. However, I know its buggy It may not work on your machine.
If so then my hope is that I can work with you to prove that my abilities are stronger in other places.

This Stack is a simple Typescript, Angular2, Auth0 -> express, mongo-gridfs

I have thoughts on your Authentication system as I was building this. As you can see in auth.service you can get permissions implanted into the component itself from the object given by auth0.
In comments I have it as an object literal which made me think that this could be a check done with webtask.io for quick checks of permission on route components. This webtask.io check could query auth0
and we wouldn't have to worry about updating/syncing our database to user authentication roles. Whats cool about that idea is that you can do the check in that spot in the auth.service file and keep your api focused on
providing information for your server and if the data requires permissions to access I would recommend a simple permission relation table which then again that mini webtask service could come in handy (aka no need to pollute your params or body)

The fun thing is you can inject authentication checks as either *ngIf's if there are specific components you wish to be hidden or shown based on permissions or the authentication checks can be route based or even better a mix.

As for the DAL or in this case it was called 'data.service'. In a more production based app I would have put the toaster in the service and for several routes I would keep a convention of '{componentName}.dal.service.ts'. 
Also I would have the data that the component will use as public in the service and inject into the component (typescript allows for readonly datatypes). This would ensure the clear seperation of data and component logic data (example: isLoading).

I have disabled the multiauth for administrators because the only admin currently is me. However, the rule can be changed to whatever class of permissions you want aswell as everyone across the board.

#Requirements
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