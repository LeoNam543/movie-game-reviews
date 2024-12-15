# Movie/Game reviews
This application is a website where user can register, create and manage reviews for movies/games.
The application server is responsible for processing API requests and serving front-end static files.

1) Clone project
```bash
git clone https://github.com/LeoNam543/movie-game-reviews.git
```
2) Open project directory in terminal.
```bash
cd your/path/to/project/movie-game-reviews 
```
3) Install dependencies:

```bash
bun install
```
4) Add admin credentials file:

Update fields values with <strong>your admin credentials</strong> in the script below.

Copy the script in your CMD(windows) terminal and press Enter.
   
```bash
echo export const adminName = "AdminUser" > admin_credentials.ts;
echo export const adminGmail = "admin@gmail.com" >> admin_credentials.ts;
echo export const adminPassword = "admin123" >> admin_credentials.ts;
echo >> admin_credentials.ts;
```

Note: Please ignore multiple line warning and click `Paste anyway` and press `Enter`.

Note: Admin credentials added this way to avoid exposing them on Github.

5) Initialise database
```bash
bun .\initialize.ts
```

6) Start web server:

```bash
bun run server.ts
```
7) Open app in browser

This app can be opened locally using link http://localhost:3000, or if deployed to e.g. `Azure/AWS` using vendor provided domain.

To login as admin use the credetials you added on step 4)

This project was created using `bun init` in bun v1.1.34. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
