import { register } from './register';

const BASE_PATH = '.';
const server = Bun.serve({
    port: 3000,
    static: {
        // serve a file by buffering it in memory
        "/": new Response(await Bun.file("./web/loged_in_page.html").bytes(), {
            headers: {
                "Content-Type": "text/html",
            },
        }),
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

                register(p.nickname, p.email, p.password)
                debugger;
                return Response.redirect("/", 301);
            }
        }

        return new Response("hoho");
    },
});

console.log(`Listening on http://localhost:${server.port} ...`);