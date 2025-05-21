import { createPool, type Pool, type PoolConnection } from "mysql2";


namespace db {
    /**
     * Create connections pool to the database passed in the env
     * @return (Pool)
     */
    export function connectDb(): Pool {
        const pool: Pool = createPool({
            host: process.env.DATABASE_HOST,
            port: parseInt(process.env.DATABASE_PORT ?? "3306"),
            user: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_SCHEMA,

            connectionLimit: parseInt(process.env.DATABASE_CONNLIMIT ?? "10"),
            waitForConnections: true,
            queueLimit: 0,
            multipleStatements: false,

            timezone: "+00:00",

            decimalNumbers: true
        });

        pool.getConnection((error: NodeJS.ErrnoException | null, connection?: PoolConnection) => {
            if (!!error) {
                console.error(`\x1b[31m[mysql] error while connecting to database\x1b[0m `);
            } else {
                console.log(`\x1b[32m[mysql] connected to mysql database\x1b[0m`);
            }

            connection?.release();
        });

        return pool;
    }
}

export = db;