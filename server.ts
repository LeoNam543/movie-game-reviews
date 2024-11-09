const BASE_PATH = './web';
const server = Bun.serve({
    port: 3000,
    static: {   
        // serve a file by buffering it in memory
        "/": new Response(await Bun.file("./web/index.html").bytes(), {
          headers: {
            "Content-Type": "text/html",
          },
        }),
      },
    
       
      async fetch(req) {
        const filePath = BASE_PATH + new URL(req.url).pathname;
        const file = Bun.file(filePath);

        return new Response(file);
      },
  });
  
  console.log(`Listening on http://localhost:${server.port} ...`);