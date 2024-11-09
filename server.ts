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
        }

        return new Response("hoho");
    },
});

console.log(`Listening on http://localhost:${server.port} ...`);