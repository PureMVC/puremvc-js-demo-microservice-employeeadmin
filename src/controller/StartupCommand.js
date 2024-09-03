//
//  StartupCommand.js
//  PureMVC JS Demo - EmployeeAdmin Microservice
//
//  Copyright(c) 2023 Saad Shams <saad.shams@puremvc.org>
//  Your reuse is governed by the Creative Commons Attribution 3.0 License
//

import {readFileSync} from 'fs';
import {fileURLToPath} from 'url';
import path from "node:path";
import mysql from "mysql";

import {SimpleCommand} from "@puremvc/puremvc-js-multicore-framework";
import {ApplicationFacade} from "../ApplicationFacade.js";
import {ServiceCommand} from "./ServiceCommand.js";
import {ServiceProxy} from "../model/ServiceProxy.js";
import {ServiceMediator} from "../view/ServiceMediator.js";
import {Service} from "../view/components/Service.js";
import {MySQL} from "../model/connections/MySQL.js";
import {UserData} from "../model/data/UserData.js";
import {RoleData} from "../model/data/RoleData.js";

export class StartupCommand extends SimpleCommand {

    execute(notification) {
        let env = {
            "DATABASE_HOST": process.env.DATABASE_HOST,
            "DATABASE_PORT": process.env.DATABASE_PORT,
            "MYSQL_DATABASE": process.env.MYSQL_DATABASE,
            "MYSQL_USER": process.env.MYSQL_USER,
            "MYSQL_PASSWORD": process.env.MYSQL_PASSWORD
        };
        for (let key in env) {
            if(env[key] == null) throw new Error("Please set the " + key + " in env variables and try again.")
        }

        const pool = mysql.createPool({
            host: env.DATABASE_HOST,
            port: env.DATABASE_PORT,
            database: env.MYSQL_DATABASE,
            user: env.MYSQL_USER,
            password: env.MYSQL_PASSWORD
        });
        const mySQL = new MySQL(pool);

        const __dirname = path.dirname(fileURLToPath(import.meta.url));
        const options = { // SSL Certificates
            key: readFileSync(path.join(__dirname, "../../assets/server.key")),
            cert: readFileSync(path.join(__dirname, "../../assets/server.cert")),
        };

        mySQL.tryConnecting()
            .then(() => {
                this.facade.registerCommand(ApplicationFacade.SERVICE, () => new ServiceCommand());
                this.facade.registerProxy(new ServiceProxy(mySQL, new UserData(), new RoleData()));
                this.facade.registerMediator(new ServiceMediator(new Service(options)));
            });
    }
}
