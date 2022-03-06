import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import path from "path";
import cors from "cors";
import fileUpload from 'express-fileupload'

import banners from './routes/banners.js'

dotenv.config();
const app = express();

//settings
app.set("port", process.env.PORT || 8000);

// middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(fileUpload());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT,  DELETE"
  );
  res.header("Allow", "GET, POST, DELETE");
  app.use(cors());
  next();
});

// routes
app.use("/api", banners);

// this folder for app will be used to store public files
app.use("/banners", express.static(path.resolve("src/banners")));

export default app;
