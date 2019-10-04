//
//  ServiceProxy.js
//  PureMVC JS Demo - EmployeeAdmin Microservice
//
//  Copyright(c) 2019 Saad Shams <saad.shams@puremvc.org>
//  Your reuse is governed by the Creative Commons Attribution 3.0 License
//

let puremvc = require("puremvc");
let db;

Array.zip = function(a, b) { // merge arrays
    return a.map(function(item, index){
        return {id: item, name: b[index]};
    });
};

function ServiceProxy($db) {
    puremvc.Proxy.call(this, this.constructor.NAME, null);
    db = $db;
}

ServiceProxy.prototype = new puremvc.Proxy;
ServiceProxy.prototype.constructor = ServiceProxy;

// find all users
ServiceProxy.prototype.findAll = function() {
    return new Promise(function(resolve, reject){
        let sql = '\
                SELECT \
                  employee.id, employee.username, employee.first, employee.last, employee.email, \
                  GROUP_CONCAT(role.id) AS "role.ids",\
                  GROUP_CONCAT(role.name) AS "role.names",\
                  department.id AS "department.id", \
                  department.name AS "department.name" \
                FROM employee\
                INNER JOIN department ON employee.department_id = department.id \
                INNER JOIN employee_role ON employee.id = employee_role.employee_id\
                INNER JOIN role ON employee_role.role_id = role.id\
                GROUP BY employee.id\
                ORDER BY employee.id';
        db.query(sql, function(error, result){
            try {
                if(error) {
                    reject({status: 500, result: {code: 500, message: error.sqlMessage}});
                } else {
                    if(result.length == 0) {
                        reject({status: 404, result: {code: 404, message: "Resource not found"}});
                    } else {
                        let data = [];
                        result.map(function(item){
                            data.push({
                                id: item.id,
                                username: item.username,
                                first: item.first,
                                last: item.last,
                                email: item.email,
                                roles: Array.zip(item["role.ids"].split(","), item["role.names"].split(",")),
                                department: {
                                    id: item["department.id"],
                                    name: item["department.name"]
                                }
                            });
                        });
                        resolve({status: 200, result: data});
                    }
                }
            } catch(err) {
                reject({status: 500, result: err});
            }
        });
    });
};

// get a user by id
ServiceProxy.prototype.getById = function(id) {
    return new Promise(function (resolve, reject) {
        let sql = '\
            SELECT \
              employee.id, employee.username, employee.first, employee.last, employee.email, \
              GROUP_CONCAT(role.id) AS "role.ids", \
              GROUP_CONCAT(role.name) AS "role.names", \
              department.id AS "department.id", \
              department.name AS "department.name" \
            FROM employee \
            INNER JOIN department ON employee.department_id = department.id \
            INNER JOIN employee_role ON employee.id = employee_role.employee_id \
            INNER JOIN role ON employee_role.role_id = role.id \
            WHERE employee.id = ? \
            GROUP BY employee.id';

        db.query(sql, id, function (error, result) {
            try {
                if(error) {
                    reject({status: 500, result: error});
                } else {
                    if(result.length == 0) {
                        reject({status: 404, result: {code: 404, message: "Resource not found"}});
                    } else {
                        let data = {};
                        result.map(function(item){
                            data = {
                                id: item.id,
                                username: item.username,
                                first: item.first,
                                last: item.last,
                                email: item.email,
                                roles: Array.zip(item["role.ids"].split(","), item["role.names"].split(",")),
                                department: {
                                    id: item["department.id"],
                                    name: item["department.name"]
                                }
                            };
                        });
                        resolve({status: 200, result: data});
                    }
                }
            } catch(err) {
                reject({status: 500, result: err});
            }
        });
    });
};

// add a user to the database
ServiceProxy.prototype.save = function(data) {
    return new Promise(function (resolve, reject) {
        try {
            let sql = "INSERT INTO employee(username, first, last, email, department_id) VALUES(?, ?, ?, ?, ?)";
            db.query(sql, [data.username, data.first, data.last, data.email, data.department.id], function(error, result){
                try {
                    if(error) {
                        reject({status: 500, result: error});
                    } else {
                        data.id = result.insertId;
                        resolve({status: 201, result: data});
                    }
                } catch(err) {
                    reject({status: 500, result: err});
                }
            });
        } catch (err) {
            reject({status: 500, result: err});
        }
    });
};

// update a user in the database
ServiceProxy.prototype.updateById = function(id, data) {
    return new Promise(function (resolve, reject) {
        try {
            let sql = "UPDATE employee SET first = ?, last = ?, email = ?, department_id = ? WHERE id = ?";
            db.query(sql, [data.first, data.last, data.email, data.department.id, id], function(error, result){
                try {
                    if(error) {
                        reject({status: 500, result: error});
                    } else {
                        data.id = id;
                        result.affectedRows == 1 ? resolve({status: 200, result: data}) : reject({status: 404, result: {code: 404, message: "Resource not found"}});
                    }
                } catch(err) {
                    reject({status: 500, result: err});
                }
            });
        } catch(err) {
            reject({status: 500, result: err});
        }
    });
};

// delete a user from the data
ServiceProxy.prototype.deleteById = function(id) {
    return new Promise(function (resolve, reject) {
        let sql = "DELETE FROM employee WHERE id = ?";
        db.query(sql, id, function(error, result){
            try {
                if(error) {
                    reject({status: 500, result: error});
                } else {
                    result.affectedRows == 1 ? resolve({status: 204, result: null}) : reject({status: 404, result: {code: 404, message: "Resource not found"}});
                }
            } catch(err) {
                reject({status: 500, result: err});
            }
        });
    });
};

ServiceProxy.NAME = "ServiceProxy";

module.exports = ServiceProxy;