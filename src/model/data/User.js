//
//  User.js
//  PureMVC JS Demo - EmployeeAdmin Microservice
//
//  Copyright(c) 2023 Saad Shams <saad.shams@puremvc.org>
//  Your reuse is governed by the Creative Commons Attribution 3.0 License
//

export class User {

    constructor() {}

    findAllUsers(connection) {
        return new Promise((resolve, reject) => {
            let sql =
                `SELECT user.id, user.username, user.first, user.last, user.email, user.password,
                      department.id AS 'department.id', department.name AS 'department.name',
                      GROUP_CONCAT(role.id ORDER BY role.id) AS 'role.ids', 
                      GROUP_CONCAT(role.name SEPARATOR ',') AS 'role.names'
                FROM user
                        LEFT JOIN department ON user.department_id = department.id
                        LEFT JOIN user_role ON user.id = user_role.user_id
                        LEFT JOIN role ON user_role.role_id = role.id
                GROUP BY user.id
                ORDER BY user.id`;

            connection.query(sql, [], (error, result, fields) => {
                if (error) {
                    reject({status: 500, body: error.sqlMessage});
                } else {
                    let data = result.map(data => {
                        let ids = data["role.ids"] ? data["role.ids"].split(",").map(id => parseInt(id)) : [];
                        let names = data["role.names"] ? data["role.names"].split(",") : [];
                        let roles = ids.map((id, index) => ({ id, name: names[index] }));

                        return {
                            id: data.id, username: data.username, first: data.first, last: data.last,
                            email: data.email, password: data.password,
                            department: { id: data["department.id"], name: data["department.name"] },
                            roles: roles
                        };
                    });
                    resolve({status: 200, body: data});
                }
            });
        });
    }

    findUserById(connection, id) {
        return new Promise((resolve, reject) => {
            let sql = `
                SELECT user.id, user.username, user.first, user.last, user.email, user.password,
                   department.id AS "department.id", department.name AS "department.name",
                   GROUP_CONCAT(role.id) AS "role.ids", 
                   GROUP_CONCAT(role.name) AS "role.names"
                FROM user 
                LEFT JOIN department ON user.department_id = department.id 
                LEFT JOIN user_role ON user.id = user_role.user_id 
                LEFT JOIN role ON user_role.role_id = role.id 
                WHERE user.id = ? 
                GROUP BY user.id`;

            connection.query(sql, [id], (error, result) => {
                if (error) {
                    reject({status: 500, body: error.sqlMessage});
                } else {
                    if (result.length === 0)
                        return reject({status: 404, body: "Resource not found"});

                    let ids = result[0]["role.ids"] ? result[0]["role.ids"].split(",").map(id => parseInt(id)) : [];
                    let names = result[0]["role.names"] ? result[0]["role.names"].split(",") : [];
                    let roles = ids.map((item, index) => ({id: item, name: names[index]}));

                    let data = {
                        id: result[0].id, username: result[0].username, first: result[0].first, last: result[0].last,
                        email: result[0].email, password: result[0].password,
                        department: { id: result[0]["department.id"], name: result[0]["department.name"] },
                        roles: roles
                    };
                    resolve({status: 200, body: data});
                }
            });
        });
    }

    add(connection, user) {
        return new Promise((resolve, reject) => {
            let sql = "INSERT INTO user(username, first, last, email, password, department_id) VALUES(?, ?, ?, ?, ?, ?)";
            let values = [user.username, user.first, user.last, user.email, user.password, user.department.id];
            connection.query(sql, values, (error, result) => {
                if (error) {
                    reject({status: 500, body: error.sqlMessage});
                } else {
                    user.id = result.insertId;
                    resolve({status: 201, body: user});
                }
            });
        });
    }

    update(connection, user) {
        return new Promise((resolve, reject) => {
            let sql = "UPDATE user SET first = ?, last = ?, email = ?, password = ?, department_id = ? WHERE id = ?";
            let values = [user.first, user.last, user.email, user.password, user.department.id, user.id];
            connection.query(sql, values, (error, result) => {
                error ? reject({status: 500, body: error.sqlMessage}) : resolve({status: 200, body: result});
            });
        });
    }

    deleteById(connection, id) {
        return new Promise((resolve, reject) => {
            let sql = "DELETE FROM user WHERE id = ?";
            connection.query(sql, [id], (error, result) => {
                if (error) {
                    reject({status: 500, body: error.sqlMessage});
                } else {
                    result.affectedRows === 1 ? resolve({status: 204, body: null}) :
                        reject({ status: 404, body: "Resource not found"});
                }
            });
        });
    }

    findAllDepartments(connection) {
        return new Promise((resolve, reject) => {
            let sql = "SELECT id, name FROM department";
            connection.query(sql, [], (error, result) => {
                error ? reject({status: 500, body: error.sqlMessage}) : resolve({status: 200, body: result});
            });
        });
    }

}
