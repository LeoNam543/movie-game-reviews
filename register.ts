import { Database } from "bun:sqlite";
const db = new Database("movie-reviews.sqlite");
import { v4 as uuidv4 } from 'uuid';

export function register(nickname: string, email: string, password: string) {

    const query = db.query(`
        select count(*) as counter from user where email="${email}"
        `);
    const res = query.get() as { counter: number };

    if (res.counter > 0) {
        throw new Error("User already registered.");
    }

    db.query(`
        insert into user (nickname, email, password)
        values ("${nickname}", "${email}", "${password}")
        `).run();
    let userbase = db.query(`
        select * from user
        `).all();
    console.log(userbase)


    const result = db.query(`
        select id from user where email="${email}" and password="${password}"
        `).get() as { id: number };
    const userId = result.id

    const sessionId = uuidv4();

    const lastActive = Date.now()
    db.query(`
        insert into session (session_id, user_id, last_active)
        values ("${sessionId}", "${userId}", "${lastActive}")
        `).run();
    let sessioninfo = db.query(`
        select * from session
        `).all();
    console.log(sessioninfo)


    //TODO make cookies
    return Response.redirect("/", 301);
}


export function signin(email: string, password: string) {
    const query = db.query(`
        select count(*) as counter from user where email="${email}" and password="${password}"
        `)
    const res = query.get() as { counter: number }
    if (res.counter === 0) {
        throw new Error("User not found")
    }
    //TODO ad session.
    return Response.redirect("/", 301);

}

