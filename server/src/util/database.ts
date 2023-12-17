import {Connection, createConnection} from "mariadb";
import config from "../../config.json";

class DatabaseUtil {
    private readonly connection: Promise<Connection>;
    constructor(host: string, port: number, user: string, password: string) {
        this.connection = createConnection({
            host: config.database.host,
            port: config.database.port,
            user: config.database.user,
            password: config.database.pass
        });
    }

    async query(sql: string, values?: any[]): Promise<any> {
        let conn = await this.connection;
        let result = await conn.query(sql, values);

        await conn.commit();

        return result;
    }

    async close(): Promise<void> {
        await (await this.connection).end();
    }
}