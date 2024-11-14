import { password } from 'bun';
import { register } from './register';
import { signin } from './register';
import { Database } from "bun:sqlite";


const BASE_PATH = '.';
const server = Bun.serve({
    port: 3000,
    static: {
        // serve a file by buffering it in memory
        // "/": new Response(await Bun.file("./web/loged_in_page.html").bytes(), {
        //     headers: {
        //         "Content-Type": "text/html",
        //     },
        // }),
        "/anon": new Response(await Bun.file("./web/index.html").bytes(), {
            headers: {
                "Content-Type": "text/html",
            },
        }),
        "/signin": new Response(await Bun.file("./web/signin_page.html").bytes(), {
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
        // Get asset files.
        if (req.url.includes('/web/')) {
            const filePath = BASE_PATH + new URL(req.url).pathname;
            const file = Bun.file(filePath);
            return new Response(file);
        }

        // API calls
        if (req.url.includes('/api/')) {
            // TODO add api calls.
            if (req.url.includes('/register')) {
                const p = await req.json();
                if (!p.nickname || !p.email || !p.password) {
                    throw new Error("not all credentials entered")
                }

                return register(p.nickname, p.email, p.password)
            }


            if (req.url.includes('/signin')) {
                const p = await req.json();
                if (!p.email || !p.password) {
                    throw new Error("not all credentials entered")
                }
                return signin(p.email, p.password)


            }

            if (req.url.includes('/test')) {
                console.log(req.headers.getSetCookie());
                debugger;

            }
        }

        debugger;
        const url = new URL(req.url);
        if (url.pathname === "/") {
            debugger;
            const cookieHeader = req.headers.get('cookie')
            if (!cookieHeader) {
                return Response.redirect("/signin", 301);
            }

            const sessionId = cookieHeader.split("=")[1]
            if (!sessionId) {
                throw new Error("Wrong cookie")
            }
            console.log(sessionId)

            debugger;

            // TODO dopilit' etu hernyu
            const db = new Database("movie-reviews.sqlite");
            const sessionIdDatabase = db.query(`
                select session_id, last_active from session
                `)

            return new Response(await Bun.file("./web/loged_in_page.html").bytes(), {
                    headers: {
                        "Content-Type": "text/html",
                    },
                });
        }
        return new Response("hoho");
    },
});

console.log(`Listening on http://localhost:${server.port} ...`);