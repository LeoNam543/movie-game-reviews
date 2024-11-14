import { Database } from "bun:sqlite";
const db = new Database("movie-reviews.sqlite");
import { v4 as uuidv4 } from 'uuid';
const http = require('http');

export function register(nickname: string, email: string, password: string) {

    // Check if user exists.
    const query = db.query(`
        select count(*) as counter from user where email="${email}"
        `);
    const res = query.get() as { counter: number };

    if (res.counter > 0) {
        throw new Error("User already registered.");
    }

    // Insert user.
    db.query(`
        insert into user (nickname, email, password)
        values ("${nickname}", "${email}", "${password}")
        `).run();
    let userbase = db.query(`
        select * from user
        `).all();
    console.log(userbase)
    const sessionId = uuidv4();
    // Create session.
    createSession(email, password, sessionId)
    const response = Response.redirect("/", 301);
    writeSessionCookie(sessionId, response)

    debugger;

    return response;
}



export function signin(email: string, password: string) {
    // Check user exists.
    const query = db.query(`
        select count(*) as counter from user where email="${email}" and password="${password}"
        `)
    const res = query.get() as { counter: number }
    if (res.counter === 0) {
        throw new Error("User not found")
    }

    const response = Response.redirect("/", 301);
    const sessionId = uuidv4();
    // Create session.
    createSession(email, password, sessionId)
    writeSessionCookie(sessionId, response)
    return response
}

function writeSessionCookie(sessionId:string, response:Response) {
     // Add session id to cookies.
     response.headers.set("Set-Cookie", `sessionId=${sessionId}; Path=/;`,);
     console.log(response.headers.getSetCookie())
 
}

function createSession(email:string, password:string, sessionId:string) {
    // Find user id.
    const result = db.query(`
        select id from user where email="${email}" and password="${password}"
        `).get() as { id: number };
    const userId = result.id
    // Find date.
    const lastActive = Date.now()
    // insert into session.
    db.query(`
        insert into session (session_id, user_id, last_active)
        values ("${sessionId}", "${userId}", "${lastActive}")
        `).run();
    let sessionInfo = db.query(`
        select * from session
        `).all();
    console.log(sessionInfo)
}
