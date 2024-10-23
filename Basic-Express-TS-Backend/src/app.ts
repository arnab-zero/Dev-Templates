import express, { Application } from "express";
import cors from "cors";
import { UserRouter } from "./app/modules/user/user.route";

const app: Application = express();

// Parsers
app.use(express.json());
app.use(cors());

// routers
app.use("/users", UserRouter);

console.log(process.cwd());

export default app;

