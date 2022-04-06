


CREATE DATABASE mybus;


CREATE TABLE owners(
   owner_id  SERIAL PRIMARY KEY ,
   owner_name TEXT NOT NULL,
   owner_email VARCHAR(50)  NOT NULL,
   owner_password VARCHAR(100)  NOT NULL
 ) ;