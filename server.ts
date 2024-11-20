import { register } from './register';
import { signin } from './register';
import { Database } from "bun:sqlite";
import { v4 as uuidv4 } from 'uuid';
const ANON_PATH = '/anon'
const SIGN_IN_PATH = '/signin'
const REGISTER_PATH = '/register'
const ADD_CONTENT_PATH = '/addcontent'
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

        // External API calls
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

        if (url.pathname === '/api/is_admin') {
            const isAdmin = await checkIsAdmin(req)
            return Response.json({ isAdmin });
        }

        if (url.pathname === '/api/logout') {
            console.log("logged out")
            const response = Response.redirect(SIGN_IN_PATH);
            response.headers.set("Set-Cookie", `sessionId=; Path=/;`);
            return response
        }

        if (url.pathname === ADD_CONTENT_PATH) {
            if (!checkIsAdmin(req)) {
                return Response.redirect(HOME_PATH);
            }

            return new Response(await Bun.file("./web/add_content.html").bytes(), {
                headers: {
                    "Content-Type": "text/html",
                },
            });
        }

        if (url.pathname === '/api/addcontent') {
            console.log("addcontent")

            const formData = await req.formData();
            const fieldsData = formData.get('fields') as string;
            const fileData = formData.get('file') as Blob;

            console.log(typeof fileData)

            if (!fieldsData || !fileData) {
                throw new Error()
            }
            const fields = JSON.parse(fieldsData)
            const file = await fileData.bytes();

            const db = new Database("movie-reviews.sqlite");


            // Insert image into DB.
            const fileId = uuidv4();
            const query = db.prepare("insert into files (file_id, data) values (?, ?)");
            query.values(fileId, file)
            query.run()

            // Add film to DB.
            debugger
            const contentName = fields.contentName
            const contentDesc = fields.contentDesc
            const contentType = fields.contentType
            // const result = db.query(`
            //         select data from files where file_id="${fileId}"
            //         `).get() as { data: Uint8Array };
            if (!contentName || !contentDesc || !contentType || !fileId) {
                console.log("Not all values")
                throw new Error("something went wrong")
            }

            db.query(`
                insert into content (content_name, content_description, content_type, img_id)
                values ("${contentName}", "${contentDesc}", "${contentType}", "${fileId}")
                `).run()

            const contentTable = db.query(`
                select * from content   
            `).all();
            console.log(contentTable)
            return Response.redirect(HOME_PATH);



            // debugger;
            // if (!formData.contentName || !formData.contentDesc || formData.contentType || formData.poster) {
            //     throw new Error("Fill out the form fully")
            // }
            // console.log(formData.contentDesc)
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