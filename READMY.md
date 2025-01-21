# RUN IT

taskkill /F /IM node.exe

md C:\W\pern1\SERVER

npm init

npm i express pg cors

touch index.js

node index.js

    CREATE DATABASE perntodo;
    
    CREATE TABLE todo(
    todo_id SERIAL PRIMARY KEY,
    description VARCHAR(255)
    );

    SELECT * FROM todo

