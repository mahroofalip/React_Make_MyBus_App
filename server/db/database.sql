


CREATE DATABASE mybus;


CREATE TABLE owners(
   owner_id  SERIAL PRIMARY KEY ,
   owner_name TEXT NOT NULL,
   owner_email VARCHAR(50)  NOT NULL,
   owner_password VARCHAR(100)  NOT NULL
 ) ;

 CREATE TABLE users(
   id  SERIAL PRIMARY KEY ,
   name TEXT NOT NULL,
   email VARCHAR(50)  NOT NULL,
   password VARCHAR(100)  NOT NULL,
   mobile VARCHAR(15) NOT NULL
 ) ;