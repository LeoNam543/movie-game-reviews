import { Database } from "bun:sqlite";

const BASE_PATH = '.';
const server = Bun.serve({
    port: 3000,
    static: {
        // serve a file by buffering it in memory
        "/": new Response(await Bun.file("./web/index.html").bytes(), {
            headers: {
                "Content-Type": "text/html",
            },
        }),
        "/signin": new Response(await Bun.file("./web/signinpage.html").bytes(), {
            headers: {
                "Content-Type": "text/html",
            },
        }),
        "/register": new Response(await Bun.file("./web/RegisterPage.html").bytes(), {
            headers: {
                "Content-Type": "text/html",
            },
        }),

    },


    async fetch(req) {
        // Get asset files.
        if (req.url.includes('/web/')) {
            const filePath = BASE_PATH + new URL(req.url).pathname;
            const file = Bun.file(filePath);
            return new Response(file);
        }

        // API calls
        if (req.url.includes('/api/')) {
            // TODO add api calls.

            const db = new Database("movie-reviews.sqlite");

            debugger;

            // let query = db.query(`
            //     drop table if exists user
            // `);
            // query.run();

            db.query(`
                create table if not exists user (
                    id INTEGER PRIMARY KEY,
                    nickname TEXT
            )`
            ).run();

            db.query(`
                insert into user (nickname)
                values ("Leo")
                `).run();

            let a;
            a = db.query(`
                select count(*) from user
            `).get();

            a = db.query(`
                select * from user   
            `).all();

            console.log(a)
        }

        return new Response("hoho");
    },
});

console.log(`Listening on http://localhost:${server.port} ...`);