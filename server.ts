import { register } from './register';
import { signin } from './register';
import { Database } from "bun:sqlite";

const BASE_PATH = '.';
const server = Bun.serve({
    port: 3000,
    static: {
        "/anon": new Response(await Bun.file("./web/index.html").bytes(), {
            headers: {
                "Content-Type": "text/html",
            },
        }),
        "/login": new Response(await Bun.file("./web/signin_page.html").bytes(), {
            headers: {
                "Content-Type": "text/html",
            },
        }),
        "/register": new Response(await Bun.file("./web/register_page.html").bytes(), {
            headers: {
                "Content-Type": "text/html",
            },
        }),

    },


    async fetch(req) {
        console.log(req.url)

        // Get asset files.
        if (req.url.includes('/web/')) {
            const filePath = BASE_PATH + new URL(req.url).pathname;
            const file = Bun.file(filePath);
            return new Response(file);
        }

        const url = new URL(req.url);

        // API calls
        if (url.pathname === '/api/register') {
            console.log("in api register")
            const p = await req.json();
            if (!p.nickname || !p.email || !p.password) {
                throw new Error("not all credentials entered")
            }

            return register(p.nickname, p.email, p.password)
        }
        if (url.pathname === '/api/signin') {
            console.log("in api signin")
            const p = await req.json();
            if (!p.email || !p.password) {
                throw new Error("not all credentials entered")
            }
            return signin(p.email, p.password)
        }

        // Pages
        if (url.pathname === "/home") {
            console.log("in home")
            const cookieHeader = req.headers.get('cookie')
            if (!cookieHeader) {
                console.log('redirected to signin')
                return Response.redirect("/login");
            }

            const sessionId = cookieHeader.split("=")[1]
            if (!sessionId) {
                throw new Error("Wrong cookie")
            }
            console.log(sessionId)

            const db = new Database("movie-reviews.sqlite");
            const sessionIdDatabase = db.query(`
                select count(*) as counter from session where session_id="${sessionId}"
                `)

            const res = sessionIdDatabase.get() as { counter: number };

            if (res.counter === 0) {
                console.log('redirected to signin')
                return Response.redirect("/login", 301);
            }


            return new Response(await Bun.file("./web/loged_in_page.html").bytes(), {
                headers: {
                    "Content-Type": "text/html",
                },
            });
        }

        // For unknown path redirect to home.
        return Response.redirect('/home');
    },
});

console.log(`Listening on http://localhost:${server.port} ...`);