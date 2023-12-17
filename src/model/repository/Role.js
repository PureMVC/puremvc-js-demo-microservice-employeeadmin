//
//  Role.js
//  PureMVC JS Demo - EmployeeAdmin Microservice
//
//  Copyright(c) 2023 Saad Shams <saad.shams@puremvc.org>
//  Your reuse is governed by the Creative Commons Attribution 3.0 License
//


export class Role {

    constructor(mysql) {
        this.mysql = mysql;
    }

    findAllRoles() {
        return new Promise((resolve, reject) => {
            let sql = "SELECT id, name FROM role";
            let connection;
            this.mysql.getConnection()
                .then(c => {
                    connection = c;
                    return this.mysql.query(connection, sql, []);
                })
                .then(result => {
                    connection.release();
                    resolve({code: 200, result: result});
                }, error => {
                    connection.release();
                    reject({code: 400, result: error});
                })
        });
    }

    deleteRolesById(connection, user) {
        return new Promise((resolve, reject) => {
            let sql = "DELETE FROM employee_role WHERE employee_id = ?;"
            let values = [user.id];
            connection.query(sql, values, error => {
                error ? reject(error.sqlMessage) : resolve(user);
            });
        });
    }

    saveRolesById(connection, user) {
        return new Promise((resolve, reject) => {
            if (user.roles == null)
                return resolve(user);

            let sql = "INSERT INTO employee_role(employee_id, role_id) VALUES ?;"
            let values = user.roles.map(({id, name}) => [user.id, id]);
            connection.query(sql, [values], (error, result) => {
                error ? reject(error.sqlMessage) : resolve(user);
            });
        });
    }

}