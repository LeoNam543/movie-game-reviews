import { Database } from "bun:sqlite";
import { adminGmail, adminName, adminPassword } from './admin_credentials';

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

// Drop files table if exists.
db.query(`
    drop table if exists files    
`).run();

// Drop content
db.query(`
    drop table if exists content    
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
// not admin - 0 
// admin - 1
db.query(
    `create table
    if not exists session (
        id INTEGER NOT NULL PRIMARY KEY,
        session_id STRING NOT NULL,
        user_id INTEGER NOT NULL,
        is_admin INTEGER NOT NULL 
    )`
).run();

// Create files table. 
db.query(
    `create table
    if not exists files (
        id INTEGER NOT NULL PRIMARY KEY,
        file_id STRING NOT NULL,
        data BLOB NOT NULL
    )`
).run();

// 0 = movie, 1 = game
db.query(`
    create table if not exists content (
    id INTEGER NOT NULL PRIMARY KEY,
    content_name STRING NOT NULL,
    content_description STRING NOT NULL,
    content_type INTEGER NOT NULL,
    img_id STRING NOT NULL )
    `).run()



// Add admin user.
db.query(`
    insert into user (nickname, email, password) values ("${adminName}", "${adminGmail}", "${adminPassword}")
    `).get()


// Show users.
let a = db.query(`
    select * from user   
`).all();

// Show sessions.
console.log(a)

a = db.query(`
    select * from session   
`).all();

console.log(a)






