# software-server
This application is a website where user can register, create and manage reviews for movies/games.
The application server is responsible for processing API requests and serving front-end static files.

Install dependencies:

```bash
bun install
```
Add admin credentials file:
1) Create file in the project directory `movie-game-reviews\admin_credentials.ts` with following content
```bash
export const adminName = "AdminUser"
export const adminGmail = "admin@gmail.com"
export const adminPassword = "admin123"
```
2) Replace fields with your admin credentials.
3) Open and run `movie-game-reviews\initialize.ts` file to initialise database

Note: Admin credentials added this way to avoid exposing them on Github.


To start web server:

```bash
bun run server.ts
```

This app can be opened locally using link http://localhost:3000, or if deployed using vendor provided domain.
If you want to access admin functions (add, delete, edit content), enter admin credentials into sign-in page

This project was created using `bun init` in bun v1.1.34. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
