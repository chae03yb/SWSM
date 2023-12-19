import { mkdir } from "fs";
import { SqlError } from "mariadb";
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
            "insert into Users (username, pass) values (?, SHA2(?, 256));",
            [ req.body["username"], req.body["password"] ]
        );
        let user_id: number = (await db_util.query(
            "select id from Users where username=?",
            [ req.body["username"] ]
        ))[0]["id"];

        mkdir(`${config.wserver.data_root}/${user_id.toString().padStart(8, '0')}/vehicle`, { recursive: true }, (err) => {
            if (err) {
                console.error(err);
                res.sendStatus(500);
            }
        });
        mkdir(`${config.wserver.data_root}/${user_id.toString().padStart(8, '0')}/mcu`, { recursive: true }, (err) => {
            if (err) {
                console.error(err);
                res.sendStatus(500);
            }
        });
        res.sendStatus(201);
    } catch (err) {
        if (!(err instanceof SqlError)) {
            console.error(err);
            res.sendStatus(500);
        }
        else {
            switch (err.code) {
                case "ER_DUP_ENTRY":  // duplicate key entry
                    res.sendStatus(422);
                    break;
                case "ER_BAD_NULL_ERROR":
                    res.sendStatus(400);
                    break;
                default:
                    console.error(err);
                    res.sendStatus(500);
            }
        }
        /*
        SqlError: (conn=20, no: 1062, SQLState: 23000) Duplicate entry 'TestUser' for key 'username'
          sqlMessage: "Duplicate entry 'TestUser' for key 'username'",
          sql: "insert into Users (username, pass) values (?, ?); - parameters:['TestUser','Password124']",
          errno: 1062,
          sqlState: '23000',
          code: 'ER_DUP_ENTRY'
         */
    } finally {
        await db_util.close();
    }
}));

export default app;