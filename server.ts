import { Database } from "bun:sqlite";
import { register } from './register';

const db = new Database("movie-reviews.sqlite");

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


                const formData = await req.formData();
                const nickname = formData.get('nickname')?.toString()
                const email = formData.get('email')?.toString()
                const password = formData.get('password')?.toString()
                if(!nickname||!email||!password) {
                    throw new Error("not all credentials entered")
                }

                register(nickname, email, password)
                return Response.redirect("/", 301);


                debugger;


                // const params = await req.text();
                // const credentials = getRequestParam(params)
                // register(credentials.nickname, credentials.email, credentials.password);
            }
        }

        return new Response("hoho");
    },
});

console.log(`Listening on http://localhost:${server.port} ...`);