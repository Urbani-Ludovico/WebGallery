import express, { type NextFunction, type Request, type Response } from "express";
import compression from "compression";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import session from "express-session";
import createMemoryStore from "memorystore";
import timeout from "connect-timeout";
import path from "path";
import { connectDb } from "./modules/db/db";
import PassedData from "./modules/passed_data";


dotenv.config()

const port: number | string = process.env.PORT || 3000;
const debug: boolean = process.env.DEBUG === "true";

const app: express.Application = express();


// -------------------- APP CONFIG --------------------

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

app.use(compression());

app.disable("x-powered-by");

app.use(express.json({
    limit: process.env.BODY_MAX_SIZE + "B"
}));
app.use(express.urlencoded({
    limit: process.env.BODY_MAX_SIZE + "B",
    extended: true
}));

app.use(cookieParser());

const MemoryStore = createMemoryStore(session);

app.use(session({
    secret: [
        "y?UWOR}a=im8XL?}[YE)@TV$&'qF8iQ}L0J7+5N%Q>dx7EE'c:e7x,v*)~lc2YO", "_-lQd>_!t|[!d_(raN8702^]P0~aywIN%IwOFmQ7YZ3CV@)Z^S-Y'lGIGJ*;d69", "3e2*FI*eb{U:$hBs[8B,stnry3x8Y?>OT[o)u$Hs{>G=9d{;ox(u9tnu.r9syl%", "DYJ&{o(H_Xmqv+y:Azpqn=bk|R;uZIsaMB>W'-mD2y$KbT'K.0Y*Beblb<{;QaQ", "Yp~5oA)X.w#fBF]Tum'q%iuQ7%SGCL:gMB!;oMwlH7r*_1HI}4RaJEV'Ze]lQEX"
    ],
    store: new MemoryStore({
        checkPeriod: 12 * 60 * 60 * 1000
    }),
    name: "session",
    resave: true,
    saveUninitialized: false,
    cookie: {
        maxAge: 2 * 60 * 60 * 1000,
        secure: process.env.NODE_ENV === "production",
        httpOnly: true
    }
}));

app.use(timeout(15 * 60 * 1000));


// -------------------- APP CONFIG --------------------

//@ts-ignore
const passedData: PassedData = {
    debug,
    app,
    db: {
        gallery: connectDb()
    }
}


// -------------------- STATICS --------------------

app.use("/static", express.static(path.join(__dirname, "static")));
app.use("/styles", express.static(path.join(__dirname, "styles")));
app.use("/js", express.static(path.join(__dirname, "js")));


// -------------------- PAGES --------------------

app.enable("trust proxy");
app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.headers?.host?.slice(0, 4) === "www." || debug) {
        if (req.secure || debug) {
            next();
        } else {
            res.redirect(301, "https://" + req.headers.host + req.url);
        }
    } else {
        res.redirect(301, "https://www." + req.headers.host + req.url);
    }
});


// -------------------- RUN --------------------

app.listen(port, () => {
    console.log("\x1b[32m[express] app listening on port " + port + (debug ? " with debug mode on" : "") + "\x1b[0m");
});