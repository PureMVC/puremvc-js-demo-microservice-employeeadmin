//
//  ServiceProxy.js
//  PureMVC JS Demo - EmployeeAdmin Microservice
//
//  Copyright(c) 2019 Saad Shams <saad.shams@puremvc.org>
//  Your reuse is governed by the Creative Commons Attribution 3.0 License
//

let puremvc = require("puremvc");
let db;

function ServiceProxy($db) {
    puremvc.Proxy.call(this, this.constructor.NAME, null);
    db = $db;
}

ServiceProxy.prototype = new puremvc.Proxy;
ServiceProxy.prototype.constructor = ServiceProxy;

// get roles for a user
ServiceProxy.prototype.getUserRolesById = function(id) {
    return new Promise(function (resolve, reject) {
        try {
            let sql = "\
                SELECT * FROM employee WHERE id = ?; \
                SELECT role_id AS id, role.name AS name FROM employee_role \
                INNER JOIN role ON employee_role.role_id = role.id WHERE employee_id = ?";
            db.query(sql, [id, id], function(error, result) {
                if(error) {
                    reject({status: 500, result: error});
                } else {
                    result[0].length != 0 ? resolve({status: 200, result: result[1]}) :
                        reject({status: 400, result: {code: 400, message: "Invalid id"}});
                }
            });
        } catch(err) {
            reject({status: 500, result: err});
        }
    });
};

// update roles for a user
ServiceProxy.prototype.updateUserRolesById = function(id, roleIds) {
    return new Promise(function (resolve, reject) {
        try {
            let sql = "\
                START TRANSACTION; \
                DELETE FROM employee_role WHERE employee_id = ?; \
                INSERT INTO employee_role(employee_id, role_id) VALUES ?; \
                COMMIT;";
            let values = roleIds.map(function(role_id){
                return [id, role_id];
            });
            db.query(sql, [id, values], function(error) {
                if(error) {
                    reject({status: 500, result: error});
                } else {
                    resolve({status: 200, result: {id: id, roles: roleIds}});
                }
            });
        } catch (err) {
            reject({status: 500, result: err});
        }
    });
};

ServiceProxy.NAME = "ServiceProxy";

module.exports = ServiceProxy;