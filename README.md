# Link-Snip
 Link Shortener Service 
- This backend application provides the core functionality of a URL shortening service, allowing users to create short links and track the number of times those links are clicked.
- It also handles errors and provides a health check endpoint for monitoring the server's status.

## How to install and run locally ?
```
$ git clone https://github.com/shruti-202/link-snip.git
$ cd link-snip
$ npm install
$ npm run dev
```

## Live Link:
https://link-snip.onrender.com

## Features:
- Create short Url by first providing longUrl & shortStr using POSTMAN
  
- URL Shortening: POST endpoint ("/link") to shorten URLs.

- Redirection: GET endpoint ("/:shortStr") for URL redirection.

- Underhood the short URL consists of long URL which eventually redirects to long URL 

- Error Handling: Handles invalid URLs, empty fields, and duplicate short strings.
  
- Database Connection: Connects to MongoDB using mongoose.

- Static File Serving: Serves static files from the "public" directory.

- Health Check Endpoint: Provides a "/health" endpoint to check server status.

- Click Tracking: Tracks the number of times each link is clicked.

- Server Startup: Logs server startup message.

## Built with:
- Express.js
- MongoDB
