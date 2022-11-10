CREATE DATABASE todo_db;

CREATE TABLE todos (
    id SERIAL,
    title VARCHAR(30) NOT NULL,
    description VARCHAR(100) NOT NULL,
    PRIMARY KEY(id)
);
LAvar os pratos