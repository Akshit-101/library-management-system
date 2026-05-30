1. First thing did was looking the ERD and getting a basic idea.
2. Was thinking of mongoDB as database because i worked with that only. But ERD/modal had table so i knew it was going on rational db. So for db i justed picked postgres (which i did not have installed but here i thought i can use "postgresdb" via "docker", i confirmed this with ai and it suggested to also use "adminer" for better viewing ). Also could have a connector like prisma(orm) for postgres but did not had an idea to use(so i dropped and decided to go normal. But how because never worked with postgresdb. So then jumped to ai and it simple told to use sql to first create db and tables and then seed the data into tables).
3. Next step was basic creating repo. and then setting frontend and backend. And also made docker-compose.yaml => for runnning services on docker (postgres and adminer)
4. Then in any MERN project i would first define schema and all that stuff. But here i was confused where to start but had idea that like we want schema and raw data into system so did that and thier i used adminer.
5. After that I build middleware which was asked as auth. And used app.use at top so that any request made to server pass through it. 
6. Then made routes and api (in controller) which i tested on postman.
7. while making routes i also made extra changes in schema gien to, just to make things more clear.
8. then comes frontend : this part i mostly did with ai as i does more better ui than me and also it takes time to write components.
9. Once both frontend and backend was ready and working hand in hand with each other then i made the docker file for frontend and backend
i knew who to make basic docker file but did not knew how to set security and handling env variables for that i used ai to understand.
10. Then last think was to do was complete yaml file by providing all the services i did that and then asked ai what improvements can be done it explained about how we can hide ports, security (privliges),using temp files and using exact pin point version of image.

AI USED IN  Whole FRONTEND Seed.js improving docker and yaml files and refining the langauge of this docs 