![Text editor](https://github.com/dibbu1107/GoogleDocs/assets/76522298/25027294-1e36-417f-a5fe-e3e437a835b3)
![signup](https://github.com/dibbu1107/GoogleDocs/assets/76522298/c18dd23a-ac53-47bc-9171-285ad2fa4130)
![multipleBrowsers](https://github.com/dibbu1107/GoogleDocs/assets/76522298/36054509-b20e-410d-a0e0-3874fb1fbb3a)
![login](https://github.com/dibbu1107/GoogleDocs/assets/76522298/ad3fbfd3-b234-47f1-bfae-0a173c3564e4)
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
  "email": "divyanigam227@gmail.com",
  "password": "divya@123"
}
'




