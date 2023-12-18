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

    query(connection, sql, values) {
        return new Promise((resolve, reject) => {
            connection.query(sql, values, (error, result) => {
                error ? reject(error.sqlMessage) : resolve(result);
            });
        });
    }

    beginTransaction(connection) {
        return new Promise((resolve, reject) => {
            connection.beginTransaction((error) => {
                error ? reject(error) : resolve(connection);
            });
        });
    }

    commit(connection) {
        return new Promise((resolve, reject) => {
            connection.commit((error) => {
                error ? reject(error) : resolve(connection);
            });
        });
    }

    rollback(connection) {
        return new Promise((resolve, reject) => {
            connection.rollback(() => { reject() });
        });
    }

}