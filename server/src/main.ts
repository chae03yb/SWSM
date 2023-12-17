import express from "express";

import config from "../config.json";

import * as auth_router from "./router/auth";
import * as discord_router from "./router/discord";
import * as mcu_router from "./router/mcu";
import * as vehicle_router from "./router/vehicle";

const app = express();

app.use("/auth", auth_router.default);
app.use("/mcu", mcu_router.default);
app.use("/vehicle", vehicle_router.default);
app.use("/discord", discord_router.default);

app.listen(config.wserver.port, () => {
    console.log("Server listening...");
})