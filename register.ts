import { Database } from "bun:sqlite";

export function register(nickname: string, email: string, password: string) {
    const db = new Database("movie-reviews.sqlite");

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
}
