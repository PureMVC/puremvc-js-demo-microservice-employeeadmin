//
//  User.js
//  PureMVC JS Demo - EmployeeAdmin Microservice
//
//  Copyright(c) 2023 Saad Shams <saad.shams@puremvc.org>
//  Your reuse is governed by the Creative Commons Attribution 3.0 License
//

export class User {

    constructor(mysql, role) {
        this.mysql = mysql;
        this.role = role;
    }

    findAllUsers() {
        return new Promise((resolve, reject) => {
            let sql = "SELECT id, first, last FROM employee";
            let connection;
            this.mysql.getConnection()
                .then(conn => {
                    connection = conn;
                    return this.mysql.query(connection, sql, []);
                })
                .then(result => {
                    resolve({code: 200, result: result});
                }, error => {
                    reject({code: 400, result: error});
                })
                .finally(() => {
                    connection.release();
                })
        });
    }

    findUserById(id) {
        return new Promise((resolve, reject) => {
            let sql = '\
            SELECT \
              employee.id, employee.username, employee.first, employee.last, employee.email, employee.password, \
              GROUP_CONCAT(role.id) AS "role.ids", \
              GROUP_CONCAT(role.name) AS "role.names", \
              department.id AS "department.id", \
              department.name AS "department.name" \
            FROM employee \
            LEFT JOIN department ON employee.department_id = department.id \
            LEFT JOIN employee_role ON employee.id = employee_role.employee_id \
            LEFT JOIN role ON employee_role.role_id = role.id \
            WHERE employee.id = ? \
            GROUP BY employee.id';

            let connection;
            this.mysql.getConnection()
                .then(conn => {
                    connection = conn
                    this.mysql.query(connection, sql, [id])
                })
                .then(result => {
                    if (result.length === 0)
                        return reject({code: 404, result: "Resource not found"})

                    let data = {
                        id: result[0].id, username: result[0].username,
                        first: result[0].first, last: result[0].last,
                        email: result[0].email, password: result[0].password,
                        department: { id: result[0]["department.id"], name: result[0]["department.name"] }
                    };

                    let ids = result[0]["role.ids"] ? result[0]["role.ids"].split(",").map(id => parseInt(id)) : [];
                    let names = result[0]["role.names"] ? result[0]["role.names"].split(",") : [];

                    data.roles = ids.map((item, index) => { // zip ids and names
                        return {id: item, name: names[index]};
                    });

                    resolve({code: 200, result: data});
                }, error => {
                    reject({code: 400, result: error});
                })
                .finally(() => {
                    connection.release();
                });
        });
    }

    saveOrUpdate(user) {
        return new Promise((resolve, reject) => {
            let connection;
            this.mysql.getConnection()
                .then(this.mysql.beginTransaction)
                .then(conn => {
                    connection = conn;
                    return user.id ? this.update(connection, user) : this.save(connection, user)
                })
                .then(result => this.role.deleteRolesById(connection, result))
                .then(result => this.role.saveRolesById(connection, result))
                .then(result => {
                    return new Promise((resolve, reject) => {
                        this.mysql.commit(connection)
                            .then(conn => resolve(result))
                            .catch(error => reject(error));
                    });
                })
                .then((result) => {
                    resolve({code: user.id ? 200 : 201, result: result});
                }, (error) => {
                    return connection.rollback(() => {
                        reject({code: 400, result: error});
                    });
                })
                .finally(() => {
                    connection.release();
                });
        });
    }

    save(connection, user) {
        return new Promise((resolve, reject) => {
            let sql = "INSERT INTO employee(username, first, last, email, password, department_id) VALUES(?, ?, ?, ?, ?, ?)";
            let values = [user.username, user.first, user.last, user.email, user.password, user.department.id];
            connection.query(sql, values, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    user = JSON.parse(JSON.stringify(user));
                    user.id = result.insertId;
                    resolve(user);
                }
            });
        });
    }

    update(connection, user) {
        return new Promise((resolve, reject) => {
            let sql = "UPDATE employee SET first = ?, last = ?, email = ?, password = ?, department_id = ? WHERE id = ?";
            let values = [user.first, user.last, user.email, user.password, user.department.id, user.id];
            connection.query(sql, values, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(JSON.parse(JSON.stringify(user)));
                }
            });
        });
    }

    deleteById(id) {
        return new Promise((resolve, reject) => {
            let sql = "DELETE FROM employee WHERE id = ?";
            let connection;
            this.mysql.getConnection()
                .then(conn => {
                    connection = conn;
                    this.mysql.query(connection, sql, [id])
                })
                .then(result => {
                    result.affectedRows === 1 ? resolve({code: 204, result: null}) :
                        reject({ code: 404, result: "Resource not found"});
                }, error => {
                    reject({code: 400, result: error});
                })
                .finally(() => {
                    connection.release();
                });
        });
    }

    findAllDepartments() {
        return new Promise((resolve, reject) => {
            let sql = "SELECT id, name FROM department";
            let connection;
            this.mysql.getConnection()
                .then(conn => {
                    connection = conn;
                    return this.mysql.query(connection, sql, [])
                })
                .then(result => {
                    resolve({code: 200, result: result});
                }, error => {
                    reject({code: 400, result: error});
                })
                .finally(() => {
                    console.log("finally");
                    connection.release();
                });
        });
    }

}