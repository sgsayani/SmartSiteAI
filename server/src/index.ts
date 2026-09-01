import "dotenv/config";
import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth, CLIENT_URLS } from "./lib/auth.js";
import userRouter from "./routes/user.js";
import projectRouter from "./routes/project.js";

const app = express();

app.use(cors({ origin: CLIENT_URLS, credentials: true }));

// better-auth reads the raw request stream, so it has to be mounted before
// express.json() consumes the body.
app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json({ limit: "10mb" }));

app.get("/", (_req, res) => res.json({ status: "SmartSite AI API is running" }));

app.use("/api/user", userRouter);
app.use("/api/project", projectRouter);

app.use((_req, res) => res.status(404).json({ message: "Route not found" }));

const port = Number(process.env.PORT) || 4000;

const server = app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});

// A generation request stays open for minutes; the 5-minute default would
// abort it mid-flight.
server.requestTimeout = 0;
server.headersTimeout = 0;
