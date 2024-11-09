const server = Bun.serve({
    port: 3000,
    static: {   
        // serve a file by buffering it in memory
        "/": new Response(await Bun.file("./web/index.html").bytes(), {
          headers: {
            "Content-Type": "text/html",
          },
        }),

        "/style.css": new Response(await Bun.file("./web/style.css").bytes(), {
            // headers: {
            //   "Content-Type": "text/css",
            // },
          }),

        "/img/SignInlogo.png": new Response(await Bun.file("./web/img/SignInlogo.png").bytes(), {
            // headers: {
            //   "Content-Type": "text/css",
            // },
          }),  

        // "/favicon.ico": new Response(await Bun.file("./favicon.ico").bytes(), {
        //   headers: {
        //     "Content-Type": "image/x-icon",
        //   },
        // }),
    
        // serve JSON
        // "/api/version.json": Response.json({ version: "1.0.0" }),
      },
    
      fetch(req) {
        const url = new URL(req.url);
        const urlParts = req.url.split('/').filter(p=>p);
        
        
        if (url.pathname === "/blog") return new Response("Blog!");
        return new Response("404!");
      },
  });
  
  console.log(`Listening on http://localhost:${server.port} ...`);