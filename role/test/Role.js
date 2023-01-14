//
//  Role.js
//  PureMVC JS Demo - EmployeeAdmin Microservice
//
//  Copyright(c) 2019 Saad Shams <saad.shams@puremvc.org>
//  Your reuse is governed by the Creative Commons Attribution 3.0 License
//

let assert = require("assert");

describe("Role", function(){

    let ServiceProxy = require("../src/model/ServiceProxy");

    describe("findAll", function () {
        it("should find all records", function (done){
            let db = {
                query: function (sql, callback) {
                    callback(null, {})
                }
            }

            let serviceProxy = new ServiceProxy(db);
            serviceProxy.findAll()
                .then(function (data) {
                    done();
                })
        }) ;
    });

    describe("findByUserId", function(){

        it("should handle sql error", function(done){
            let db = {
                query: function(sql, data, callback){
                    callback({sqlMessage: "sql error"});
                }
            };

            let serviceProxy = new ServiceProxy(db);
            serviceProxy.findByUserId(1)
                .catch(function(data){
                    assert(data != null);
                    assert(data.status === 500);
                    assert(data.result.sqlMessage === "sql error");
                    done();
                });
        });

        it("should return 400 for invalid id", function(done){
            let db = {
                query: function(sql, data, callback){
                    callback(null, [[]]);
                }
            };
            let serviceProxy = new ServiceProxy(db);
            serviceProxy.findByUserId(100000)
                .catch(function(error){
                    assert(error != null);
                    assert(error.status === 400);
                    assert(error.result.message === "Invalid id");
                    done();
                });
        });

        it("should return records", function(done){
            let db = {
                query: function(sql, id, callback){
                    callback(null, [[{}], [{id: 4, name: "Employee Benefits"}, {id: 6, name: "Payroll"}]]);
                }
            };
            let serviceProxy = new ServiceProxy(db);
            serviceProxy.findByUserId(1)
                .then(function(data){
                    assert(data.status === 200);
                    assert(data.result != null);
                    assert(data.result.length === 2);
                    assert(data.result[0].id === 4);
                    assert(data.result[0].name === "Employee Benefits");
                    assert(data.result[1].id === 6);
                    assert(data.result[1].name === "Payroll");
                    done();
                }).catch(console.error);
        });
    });

    describe("updateByUserId", function(){

        it("should handle sql error", function(done){
            let db = {
                query: function(sql, data, callback){
                    callback({sqlMessage: "sql error"});
                }
            };
            let serviceProxy = new ServiceProxy(db);
            serviceProxy.updateByUserId(1, [{id: 14}, {id: 4}])
                .catch(function(data){
                    assert(data != null);
                    assert(data.status === 500);
                    assert(data.result.sqlMessage === "sql error");
                    done();
                });
        });

        it("should return 404 for an invalid id", function(done){
            let db = {
                query: function(sql, data, callback){
                    callback({code: "ER_NO_REFERENCED_ROW_2"});
                }
            };
            let serviceProxy = new ServiceProxy(db);
            serviceProxy.updateByUserId(1, [{id: 14}, {id: 4}])
                .catch(function(error){
                    assert(error != null);
                    assert(error.status === 500);
                    assert(error.result.code === "ER_NO_REFERENCED_ROW_2");
                    done();
                });
        });

        it("should update the records", function(done){
            let db = {
                query: function(sql, data, callback){
                    callback(null, {});
                }
            };

            let serviceProxy = new ServiceProxy(db);
            serviceProxy.updateByUserId(1, [{id: 14}, {id: 4}])
                .then(function(data){
                    assert(data != null);
                    assert(data.status === 200);
                    assert(data.result.length === 2);
                    done();
                });
        });
    });
});