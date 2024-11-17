import { register } from './register';
import { signin } from './register';
import { Database } from "bun:sqlite";
const ANON_PATH = '/anon'
const SIGN_IN_PATH = '/signin'
const REGISTER_PATH = '/register'
const ADMIN_PAGE_PATH = '/adminpage'
const HOME_PATH = '/home'


const BASE_PATH = '.';
const server = Bun.serve({
    port: 3000,

    async fetch(req) {
        // Get asset files.
        if (req.url.includes('/web/')) {
            const filePath = BASE_PATH + new URL(req.url).pathname;
            const file = Bun.file(filePath);
            return new Response(file);
        }
        const url = new URL(req.url);
        console.log(url.pathname)

        // External pages no auth required.
        if (url.pathname === ANON_PATH) {
            return new Response(await Bun.file("./web/index.html").bytes(), {
                headers: {
                    "Content-Type": "text/html",
                },
            });
        }
        if (url.pathname === SIGN_IN_PATH) {
            return new Response(await Bun.file("./web/signin_page.html").bytes(), {
                headers: {
                    "Content-Type": "text/html",
                },
            });
        }
        if (url.pathname === REGISTER_PATH) {
            return new Response(await Bun.file("./web/register_page.html").bytes(), {
                headers: {
                    "Content-Type": "text/html",
                },
            });
        }
       
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

         // Check user logged in.
         if (!checkUserLoggedIn(req)) {
            console.log('User is not logged in redirecting.')
            return Response.redirect(SIGN_IN_PATH);
        }

        if (url.pathname === ADMIN_PAGE_PATH) {
            if (!checkIsAdmin(req)) {
                return Response.redirect(HOME_PATH);
            }

            return new Response(await Bun.file("./web/admin_page.html").bytes(), {
                headers: {
                    "Content-Type": "text/html",
                },
            });
        }

        if (url.pathname === HOME_PATH) {
            return new Response(await Bun.file("./web/loged_in_page.html").bytes(), {
                headers: {
                    "Content-Type": "text/html",
                },
            });
        }

        // For unknown path redirect to home.
        return Response.redirect(HOME_PATH);
    },
});

console.log(`Listening on http://localhost:${server.port} ...`);


// Check if admin
function checkIsAdmin(req: Request) {
    const cookieHeader = req.headers.get('cookie')
    if (!cookieHeader) {
        return false;
    }
    const sessionId = cookieHeader.split("=")[1]
    console.log(sessionId)

    const db = new Database("movie-reviews.sqlite");
    const query = db.query(`
        select is_admin as isAdmin from session where session_id="${sessionId}"
        `)
    const res = query.get() as { isAdmin: number }

    if (res.isAdmin === 0) {
        return false
    }
    return true
}

function checkUserLoggedIn(req: Request): boolean {
    const cookieHeader = req.headers.get('cookie')
    if (!cookieHeader) {
        return false;
    }

    const sessionId = cookieHeader.split("=")[1]
    if (!sessionId) {
        return false;
    }
    console.log(sessionId)

    const db = new Database("movie-reviews.sqlite");
    const sessionIdDatabase = db.query(`
        select count(*) as counter from session where session_id="${sessionId}"
        `)

    const res = sessionIdDatabase.get() as { counter: number };

    if (res.counter === 0) {
        return false;
    }
    return true;
}