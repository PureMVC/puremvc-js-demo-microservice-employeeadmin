//
//  StartupCommand.js
//  PureMVC JS Demo - EmployeeAdmin Microservice
//
//  Copyright(c) 2023 Saad Shams <saad.shams@puremvc.org>
//  Your reuse is governed by the Creative Commons Attribution 3.0 License
//


import {puremvc} from "../../api/puremvc-2.0.0.js";
import {ApplicationFacade} from "../ApplicationFacade.js";
import {ServiceCommand} from "./ServiceCommand.js";
import {ServiceProxy} from "../model/ServiceProxy.js";
import {ServiceMediator} from "../view/ServiceMediator.js";
import {Service} from "../view/components/Service.js";

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';

import path from "node:path";
import mysql from "mysql";
import {MySQL} from "../model/connections/MySQL.js";
import {Role} from "../model/repository/Role.js";
import {User} from "../model/repository/User.js";

export class StartupCommand extends puremvc.SimpleCommand {

    execute(notification) {
        let env = {"DATABASE_HOST": process.env.DATABASE_HOST,
            "DATABASE_PORT": process.env.DATABASE_PORT,
            "MYSQL_DATABASE": process.env.MYSQL_DATABASE,
            "MYSQL_USER": process.env.MYSQL_USER,
            "MYSQL_PASSWORD": process.env.MYSQL_PASSWORD
        };

        for (let key in env) {
            if(env[key] == null) throw new Error("Please set the " + key + " in env variables and try again.")
        }

        let pool = mysql.createPool({
            host: env.DATABASE_HOST,
            port: env.DATABASE_PORT,
            database: env.MYSQL_DATABASE,
            user: env.MYSQL_USER,
            password: env.MYSQL_PASSWORD,
            multipleStatements: true
        });

        this.database(pool)
            .then(()=> {
                const __dirname = path.dirname(fileURLToPath(import.meta.url));
                const options = { // SSL
                    key: readFileSync(path.join(__dirname, "../../assets/server.key")),
                    cert: readFileSync(path.join(__dirname, "../../assets/server.cert")),
                };

                let mySQL = new MySQL(pool);
                let role = new Role(mySQL);
                let user = new User(mySQL, role);

                this.facade.registerCommand(ApplicationFacade.SERVICE, () => new ServiceCommand());
                this.facade.registerProxy(new ServiceProxy(user, role));
                this.facade.registerMediator(new ServiceMediator(new Service(options)));
            });
    }

    async database(pool) {
        return new Promise(function (resolve, reject) {
            console.log("Connecting MySQL...");
            let intervalId = setInterval(function(){
                pool.query("SELECT 1 FROM dual", function (error) {
                    if (error) {
                        console.log("MySQL: " + error);
                    } else {
                        clearInterval(intervalId);
                        resolve();
                    }
                });
            }, 1000);
        });
    }
}