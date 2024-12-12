import { register } from './register';
import { signin } from './register';
import { Database } from "bun:sqlite";
import { v4 as uuidv4 } from 'uuid';
const ANON_PATH = '/anon'
const SIGN_IN_PATH = '/signin'
const REGISTER_PATH = '/register'
const ADD_CONTENT_PATH = '/addcontent'
const EDIT_CONTENT_PATH = '/editcontent/'
const HOME_PATH = '/home'
const CONTENT_PATH = '/media/'

const BASE_PATH = '.';
const server = Bun.serve({
    port: 3000,

    async fetch(req) {
        const url = new URL(req.url);
        console.log(url.pathname)
        const db = new Database("movie-reviews.sqlite");


        // Get asset files.
        if (req.url.includes('/web/')) {

            if (req.url.includes('content_img')) {
                const pathParts = url.pathname.split("/")
                const imageId = pathParts[pathParts.length - 1]
                const res = db.query(`
                    select data from files where file_id="${imageId}"
                    `).get() as { data: Uint8Array }
                return new Response(res.data)
            }

            const filePath = BASE_PATH + new URL(req.url).pathname;
            const file = Bun.file(filePath);
            return new Response(file);
        }

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

        // Internal API.
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
        if (url.pathname === '/api/get_specific_content') {
            const contentId = await req.text()
            const res = db.query(`
                select content_name, content_description, content_type, img_id, average_rating from content where id="${contentId}"
                `).get() as { content_name: string, content_description: string, content_type: number, img_id: string, average_rating: number }[]
            return Response.json({ content: res })
        }

        if (url.pathname === '/api/get_specific_review') {
            const userId = getUserIdFromCookie(req, db);
            const contentId = await req.text()
            const res = db.query(`
                select review, star_rating from reviews where (content_id="${contentId}" and user_id="${userId}")
                `).get() as { review: string, star_rating: number}[]
            return Response.json({ content: res })
        }

        if (url.pathname === '/api/delete-content') {
            const contentId = await req.text()
            const res = db.query(`
                select img_id as imgID from content where id="${contentId}"
                `).get() as { imgID: string }

            const value = Object.values(res).toString()
            db.query(`
                delete from content where id="${contentId}"
            `).run()
            db.query(`
                delete from files where file_id="${value}"
            `).run()
            return Response.redirect(HOME_PATH);
        }
        if (url.pathname === "/api/editcontent") {
            const formData = await req.formData()
            const fieldsData = formData.get('fields') as string;

            if (!fieldsData) {
                throw new Error()
            }
            const fields = JSON.parse(fieldsData)
            const contentId = fields.contentId

            const fileData = formData.get('file') as Blob;
            if (fileData) {
                console.log(typeof fileData)
                const file = await fileData.bytes();

                const res = db.query(`
                    select img_id from content where  id="${contentId}"`
                ).get() as { img_id: string }

                const query = db.prepare(`update files set (data)=(?) where file_id="${res.img_id}"`);
                query.values(file)
                query.run()
            }

            const contentName = fields.contentName
            const contentDesc = fields.contentDesc
            const contentType = fields.contentType
            db.query(`
                update content set content_name="${contentName}", content_description="${contentDesc}", content_type="${contentType}" where id="${contentId}"
                `).run()




            // db.query(`
            //     update files set data=${file} where file_id="${res.img_id}"
            //     `).run()

            // const cuh = db.query(`
            //     select data from files where file_id="${res.img_id}"`
            // ).get()
            const cuh1 = db.query(`
                select * from files`
            ).all()
            console.log(cuh1)

            // console.log(cuh)
            // debugger
        }
        if (url.pathname === '/api/get_content') {
            console.log("get content")
            const res = db.query(`
                select id, content_name, img_id, content_type, average_rating from content
                `).all() as { id: string, content_name: string, img_id: string, content_type: number, average_rating: number}[]
            return Response.json({ content: res })
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
                insert into content (content_name, content_description, content_type, img_id, average_rating)
                values ("${contentName}", "${contentDesc}", "${contentType}", "${fileId}", ${0})
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
        if (url.pathname === "/api/add_review") {
            const p = await req.json();
            if (!p.contentId || !p.review || !p.rating) {
                throw new Error("Not everything submited")
            }
            const contId = p.contentId
            const reviewText = p.review
            const starRating = p.rating
            const userId = getUserIdFromCookie(req, db);

            const amountReviews = db.query(`
                select count(*) as count from reviews where user_id="${userId}" and content_id="${contId}"
                `).get() as { count : number }
            if (amountReviews.count > 0) {
                throw new Error("review already exists")
            }
            db.query(`
                insert into reviews (review, star_rating, user_id, content_id) values ("${reviewText}", ${starRating}, "${userId}", "${contId}")
                `).run()
            let asd = db.query(`
                select * from reviews
                `).all()
            console.log(asd)

            updateContentRating(db, contId)

            return new Response()
        }

        if (url.pathname === "/api/edit_user_review") {
            const p = await req.json();
            if (!p.contentId || !p.review || !p.editRating) {
                throw new Error("Not everything submited")
            }
            const contId = p.contentId
            const reviewText = p.review
            const starRating = p.editRating
            const userId = getUserIdFromCookie(req, db);

            const query = db.prepare(`update reviews set (review, star_rating)=(?, ?) where (content_id="${contId}" and user_id="${userId}")`);
            query.values(reviewText, starRating)
            query.run()
            updateContentRating(db, contId)

            return new Response()
            
        }
        if (url.pathname === "/api/reviews_get") {
            const { contentId } = await req.json();

            const userId = getUserIdFromCookie(req, db)
            // Get all reviews for the current content id excluding current user review
            // as we are going to show it separately.
            const reviews = db.query(`
                select r.review, r.star_rating, u.nickname
                from reviews r join user u on r.user_id = u.id
                where r.content_id = ${contentId} and r.user_id != ${userId}
                order by r.id desc
                `).all() as { review: string, star_rating: number, user_id: number, content_id: number }[]

            return new Response(JSON.stringify(reviews));
        }
        if (url.pathname === "/api/get_user_review_for_content") {
            const { contentId } = await req.json();
            const userId = getUserIdFromCookie(req, db)
            const review = db.query(`
                select r.review, r.star_rating, u.nickname
                from reviews r join user u on r.user_id = u.id
                where r.content_id = ${contentId} and r.user_id = ${userId}
                `).get() as { review: string, star_rating: number, nickname: string } | undefined

            return new Response(JSON.stringify({ review }));
        }
        if (url.pathname === "/api/delete_user_review_for_content") {
            const { contentId } = await req.json();
            const userId = getUserIdFromCookie(req, db)
            db.query(`
                delete from reviews
                where content_id = ${contentId} and user_id = ${userId}
                `).run()
            
                updateContentRating(db, contentId)

            return new Response();
        }

        // Internal pages.
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
        if (url.pathname.includes(EDIT_CONTENT_PATH)) {
            if (!checkIsAdmin(req)) {
                return Response.redirect(HOME_PATH);
            }

            return new Response(await Bun.file("./web/edit_content.html").bytes(), {
                headers: {
                    "Content-Type": "text/html",
                },
            });
        }
        if (url.pathname.includes(CONTENT_PATH)) {
            return new Response(await Bun.file("./web/content_page.html").bytes(), {
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

function getUserIdFromCookie(req: Request, db: Database) {
    const cookieHeader = req.headers.get('cookie')
    if (!cookieHeader) {
        return false;
    }
    const sessionId = cookieHeader.split("=")[1]
    const res = db.query(`
                select user_id from session where session_id="${sessionId}"
                `).get() as { user_id: number }
    return res.user_id;
}

function updateContentRating(db: Database, contentId: number) {
    const avgRating = db.query(`
        select coalesce(avg(star_rating), ${0}) as average from reviews where content_id="${contentId}"
        `).get() as { average : number }
    db.query(`
        update content set average_rating=${avgRating.average} where id="${contentId}"
        `).run()
    const avgshow = db.query(`
        select * from content
        `).all()
}
