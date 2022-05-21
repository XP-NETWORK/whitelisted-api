import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { whiteListedRouter } from "./routes";
import config from "./config";




const app = express();

app.use(cors());

app.use(bodyParser.json({ limit: "2mb" }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", whiteListedRouter());

app.listen(config.port || 3100, async () => {

})
