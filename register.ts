import { Database } from "bun:sqlite";
const db = new Database("movie-reviews.sqlite");

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

