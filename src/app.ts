import express from "express";


const port: number | string = process.env.PORT || 3000;
const debug: boolean = process.argv.slice(2).includes("--debug");

const app: express.Application = express();

// -------------------- RUN --------------------

app.listen(port, () => {
    console.log("\x1b[32m[express] app listening on port " + port + (debug ? " with debug mode on" : "") + "\x1b[0m");
});