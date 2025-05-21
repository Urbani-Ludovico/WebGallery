import { type Application } from "express";
import { type Pool } from "mysql2";


interface PassedData {
    /**
     * Debug mode
     */
    debug: boolean;

    /**
     * Express application pointer
     */
    app: Application;

    /**
     * Mysql pools
     */
    db: {
        gallery: Pool
    }
}


export = PassedData;