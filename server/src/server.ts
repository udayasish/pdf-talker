import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import { dbConnect } from "./utils/db.js";

const app = express();
const port = process.env.PORT || 8000;

dbConnect();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Routes
app.use("/api/v1/user", userRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/chat", chatRoutes);

console.log("port: ", port);

app.listen(port, () => {
  console.log(`Example eapp listening on port ${port}`);
});

export default app;
