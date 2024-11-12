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
        session_id STRING NOT NULL,
        user_id INTEGER NOT NULL,
        last_active TIMESTAMP NOT NULL
    )`
).run();

let a = db.query(`
    select * from user   
`).all();

console.log(a)

a = db.query(`
    select * from session   
`).all();

console.log(a)