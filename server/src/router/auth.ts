import { mkdir } from "fs";
import { DatabaseUtil } from "../util/database";
import router, { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import config from "../../config.json";

const app = router();

// 계정 생성 시 데이터 저장 디렉토리에 @user, @user/vehicle, @user/mcu 디렉토리 생성
app.post("/register", asyncHandler(async (req: Request, res: Response, next) => {
    const db_util = new DatabaseUtil(
        config.database.host,
        config.database.port,
        config.database.user,
        config.database.pass
    );

    try {
        await db_util.query(
            "insert into Users (username, pass) values (?, ?);",
            [ req.body.username, req.body.password ]
        );
        let user_id: number = await db_util.query(
            "select id from Users where username=?",
            [ req.body.username ]
        );

        mkdir(`${config.wserver.data_root}/${user_id}/vehicle`, { recursive: true }, (err) => {
            if (err) {
                console.error(err);
                res.sendStatus(500);
            }
        });
        mkdir(`${config.wserver.data_root}/${user_id}/mcu`, { recursive: true }, (err) => {
            if (err) {
                console.error(err);
                res.sendStatus(500);
            }
        });
        res.sendStatus(201);
    } catch (err) {
        console.error(err);
        res.sendStatus(400);
    } finally {
        await db_util.close();
    }
}));

export default app;