import { Database } from "bun:sqlite";
import { v4 as uuidv4 } from 'uuid';
import { md5 } from 'js-md5';
import { adminGmail, adminPassword } from './admin_credentials';

export function register(nickname: string, email: string, password: string) {
    const db = new Database("movie-reviews.sqlite");

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

    // User display
    // let userbase = db.query(`
    //     select * from user
    //     `).all();
    // console.log(userbase)

    // Create session.
    const sessionId = uuidv4();
    createSession(email, password, sessionId, 0)
    const response = Response.redirect("/home");
    writeSessionCookie(sessionId, response)

    return response;
}

export function signin(email: string, password: string) {
    const db = new Database("movie-reviews.sqlite");
    // Check user exists.
    const query = db.query(`
        select count(*) as counter from user where email="${email}" and password="${password}"
        `)
    const res = query.get() as { counter: number }
    if (res.counter === 0) {
        throw new Error("User not found")
    }

    let redirectPath: string = '/home';
    let isAdmin: number = 0;
    // Check if admin
    if (email === adminGmail && password === adminPassword) {
        redirectPath = '/adminpage';
        isAdmin = 1;
    }

    const response = Response.redirect(redirectPath);
    const sessionId = uuidv4();
    // Create session.
    createSession(email, password, sessionId, isAdmin)
    writeSessionCookie(sessionId, response)
    return response
}

function writeSessionCookie(sessionId: string, response: Response) {
    // Add session id to cookies.
    response.headers.set("Set-Cookie", `sessionId=${sessionId}; Path=/;`,);
    // console.log(response.headers.getSetCookie())

}

function createSession(email: string, password: string, sessionId: string, isAdmin: number) {
    const db = new Database("movie-reviews.sqlite");

    // Find user id.
    const result = db.query(`
        select id from user where email="${email}" and password="${password}"
        `).get() as { id: number };
    const userId = result.id
    // insert into session.
    db.query(`
        insert into session (session_id, user_id, is_admin)
        values ("${sessionId}", "${userId}", "${isAdmin}")
        `).run();

    let sessionInfo = db.query(`
        select * from session
        `).all();
    console.log(sessionInfo)
    let userInfo = db.query(`
        select * from user
        `).all();
    console.log(userInfo)
}
