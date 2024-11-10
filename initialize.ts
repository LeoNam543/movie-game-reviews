import { Database } from "bun:sqlite";

// Create db if it does not exist.
const db = new Database("movie-reviews.sqlite");

// Drop user table if exists.
db.query(`
    drop table if exists user    
`).run();

// Drop session table if exists.
db.query(`
    drop table if exists session    
`).run();

// Create user table.
db.query(`
    create table if not exists user (
        id INTEGER NOT NULL PRIMARY KEY,
        nickname TEXT NOT NULL,
        email TEXT NOT NULL,
        password TEXT NOT NULL
        )`
).run();

// Create session table.
db.query(
    `create table
    if not exists session (
        id INTEGER NOT NULL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        last_active TIMESTAMP NOT NULL
    )`
).run();


// Tests
db.query(`
    insert into user (nickname, email, password)
    values ("Leo", "a@a.com", "123cdtnrf")    
`).run();

let a = db.query(`
    select * from user   
`).all();

console.log(a)

db.query(`
    insert into session (user_id, last_active)
    values (123, 123123123)    
`).run();

a = db.query(`
    select * from session   
`).all();

console.log(a)