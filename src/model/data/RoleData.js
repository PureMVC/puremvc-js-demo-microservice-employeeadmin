//
//  RoleData.js
//  PureMVC JS Demo - EmployeeAdmin Microservice
//
//  Copyright(c) 2023 Saad Shams <saad.shams@puremvc.org>
//  Your reuse is governed by the Creative Commons Attribution 3.0 License
//

export class RoleData {

    constructor() {}

    findAllRoles(connection) {
        return new Promise((resolve, reject) => {
            let sql = "SELECT id, name FROM role";
            connection.query(sql, [], (error, result) => {
                error ? reject({status: 500, body: error.sqlMessage}) : resolve({status: 200, body: result});
            });
        });
    }

    findRolesById(connection, id) {
        return new Promise((resolve, reject) => {
            let sql = `
                SELECT role.id, role.name FROM role
                    INNER JOIN user_role ON role.id = user_role.role_id
                WHERE user_role.user_id = ?;`
            connection.query(sql, [id], (error, result) => {
                error ? reject({status: 500, body: error.sqlMessage}) : resolve({status: 200, body: result});
            });
        });
    }

    deleteRolesById(connection, id) {
        return new Promise((resolve, reject) => {
            let sql = "DELETE FROM user_role WHERE user_id = ?;"
            let values = [id];
            connection.query(sql, values, error => {
                error ? reject({status: 500, body: error.sqlMessage}) : resolve({status: 204, body: "No Content"});
            });
        });
    }

    updateRolesById(connection, userId, roles) {
        return new Promise((resolve, reject) => {
            let sql = "INSERT INTO user_role(user_id, role_id) VALUES ?;"
            let values = roles.map(({id, name}) => [userId, id]);
            connection.query(sql, [values], (error, result) => {
                error ? reject({status: 500, body: error.sqlMessage}) : resolve({status: 200, body: roles});
            });
        });
    }

}
