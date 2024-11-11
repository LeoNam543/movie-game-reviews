import { Database } from "bun:sqlite";
const db = new Database("movie-reviews.sqlite");

export function register(nickname: string, email: string, password: string) {
    // debugger;
    // throw new Error();
    validateEmail(email);

    db.query(`
        insert into user (nickname, email, password)
        values ("${nickname}", "${email}", "${password}")
        `).run();
    let userbase = db.query(`
        select * from user
        `).all();
    console.log(userbase)

}

function validateEmail(email: string) {

    // debugger;
    // throw new Error();

    const query = db.query(`
        select count(*) as counter from user where email="${email}"
        `);
    const res = query.get() as { counter: number };


    console.log(res);
    console.log(typeof res);
    debugger;
    if (res.counter > 0) {
        throw new Error("User already registered.");
    }
}
