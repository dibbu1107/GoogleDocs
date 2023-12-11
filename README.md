# GoogleDocs

Run this command to test client code ----------

step 1: cd client.js
step 2: npm i 
step 3: npm start

To Run the app 
Open [http://localhost:3000] to view it in the browser.

Run this command to test backend server -----------

step 1: cd server.js
step 2: npm i
step 3: npm start

To test api's use this curls - 


For signup

curl --location 'http://localhost:3002/api/signup' \
--header 'Content-Type: application/json' \
--data-raw '{
  "username": "Divya Nigam",
  "email": "divyanigam227@gmail.com",
  "password": "divya@123"
}
'

For login

curl --location 'http://localhost:3002/api/login' \
--header 'Content-Type: application/json' \
--data-raw '{
  "email": "divyanigam2278@gmail.com",
  "password": "dibbu@123"
}
'



 
