//
//  MySQL.js
//  PureMVC JS Demo - EmployeeAdmin Microservice
//
//  Copyright(c) 2023 Saad Shams <saad.shams@puremvc.org>
//  Your reuse is governed by the Creative Commons Attribution 3.0 License
//

export class MySQL {

    constructor(pool) {
        this.pool = pool;
    }

    getConnection() {
        return new Promise((resolve, reject) => {
            this.pool.getConnection((error, connection) => {
                error ? reject("Error acquiring connection") : resolve(connection);
            });
        });
    }

    beginTransaction(connection) {
        return new Promise((resolve, reject) => {
            connection.beginTransaction(error => {
                error ? reject(error) : resolve(connection);
            });
        });
    }

    commit(connection) {
        return new Promise((resolve, reject) => {
            connection.commit(error => {
                error ? reject(error) : resolve(connection);
            });
        });
    }

    rollback(connection) {
        return new Promise(resolve => {
            connection.rollback(() => resolve());
        });
    }

    tryConnecting() {
        return new Promise((resolve, reject) => {
            console.log("Connecting MySQL...");
            let intervalId = setInterval(() => {
                this.pool.query("SELECT 1 FROM dual", error => {
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
