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

// get departments
ServiceProxy.prototype.findAllDepartments = function() {
    return new Promise(function (resolve, reject) {
        let sql = "SELECT * FROM department";
        db.query(sql, function(error, result){
            try {
                if(error) {
                    reject({status: 500, result: error});
                } else {
                    resolve({status: 200, result: result});
                }
            } catch(err) {
                reject({status: 500, result: err});
            }
        });
    });
};

ServiceProxy.NAME = "ServiceProxy";

module.exports = ServiceProxy;