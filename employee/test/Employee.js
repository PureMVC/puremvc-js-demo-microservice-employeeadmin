//
//  Employee.js
//  PureMVC JS Demo - EmployeeAdmin Microservice
//
//  Copyright(c) 2019 Saad Shams <saad.shams@puremvc.org>
//  Your reuse is governed by the Creative Commons Attribution 3.0 License
//

const assert = require("assert");

describe("User", function() {

    let ServiceProxy = require("../src/model/ServiceProxy");

    describe("findAll", function() {

        it("should handle sql error", function(done){
            var db = {
                query: function(sql, callback){
                    callback({sqlMessage: "SQL Error"});
                }
            };

            let serviceProxy = new ServiceProxy(db);
            serviceProxy.findAll()
                .catch(function(error){
                    assert(error != null);
                    assert(error.status == 500);
                    assert(error.result.message == "SQL Error");
                    done();
                });

        });

        it("should return 404 for empty list of users", function(done) {
            var db = {
                query: function(sql, callback){
                    callback(null, []);
                }
            };

            let serviceProxy = new ServiceProxy(db);
            serviceProxy.findAll()
                .catch(function(error){
                    assert(error != null);
                    assert(error.status == 404);
                    assert(error.result.message == "Resource not found");
                    done();
                });
        });

        it("should handle list of users", function(done){
            var db = {
                query: function(sql, callback){
                    callback(null, [{
                        id: 1, username: "lstooge", first: "Larry", last: "Stooge", email: "larry@stooges.com",
                        "role.ids": "4,6", "role.names": "Employee Benefits,Payroll",
                        "department.id": 1, "department.name": "Accounting"
                    }]);
                }
            };

            let serviceProxy = new ServiceProxy(db);
            serviceProxy.findAll()
                .then(function(data){
                    assert(data != null);
                    assert(data.status == 200);
                    assert(data.result.length == 1);
                    assert(data.result[0].id == 1);
                    assert(data.result[0].username == "lstooge");
                    assert(data.result[0].first == "Larry");
                    assert(data.result[0].last == "Stooge");
                    assert(data.result[0].email == "larry@stooges.com");
                    assert(data.result[0].roles.length == 2);
                    assert(data.result[0].roles[0].id == 4);
                    assert(data.result[0].roles[0].name == "Employee Benefits");
                    assert(data.result[0].roles[1].id == 6);
                    assert(data.result[0].roles[1].name == "Payroll");
                    assert(data.result[0].roles.length == 2);
                    assert(data.result[0].department.id == 1);
                    assert(data.result[0].department.name == "Accounting");
                    done();
                })
                .catch(console.error);

        });
    });

    describe("getById", function(){

        it("should handle sql error", function(done){
            var db = {
                query: function(sql, id, callback){
                    callback({sqlMessage: "SQL Error"});
                }
            };
            let serviceProxy = new ServiceProxy(db);
            serviceProxy.getById(1)
                .catch(function(error){
                    assert(error.status == 500);
                    assert(error.result.message = "SQL Error");
                    done();
                });
        });

        it("should handle null", function(done){
            var db = {
                query: function(sql, id, callback){
                    callback(null, []);
                }
            };
            let serviceProxy = new ServiceProxy(db);
            serviceProxy.getById(null)
                .catch(function(error){
                    assert(error.status == 404);
                    assert(error.result.message == "Resource not found");
                    done();
                });
        });

        it("should return 404 for empty record", function(done){
            var db = {
                query: function(sql, id, callback){
                    callback(null, []);
                }
            };
            let serviceProxy = new ServiceProxy(db);
            serviceProxy.getById(100000)
                .catch(function(error){
                    assert(error.status == 404);
                    assert(error.result.message == "Resource not found");
                    done();
                });
        });

        it("should handle a result", function(done){
            var db = {
                query: function(sql, id, callback){
                    callback(null, [{
                            id: 1, username: "lstooge", first: "Larry", last: "Stooge", email: "larry@stooges.com",
                            "role.ids": "4,6", "role.names": "Employee Benefits,Payroll",
                            "department.id": 1, "department.name": "Accounting"
                        }]);
                }
            };

            let serviceProxy = new ServiceProxy(db);
            serviceProxy.getById(1)
                .then(function(data){
                    assert(data.status == 200);
                    assert(data.result.id == 1);
                    assert(data.result.username == "lstooge");
                    assert(data.result.first == "Larry");
                    assert(data.result.last == "Stooge");
                    assert(data.result.email == "larry@stooges.com");
                    assert(data.result.roles.length == 2);
                    assert(data.result.roles[0].id == 4);
                    assert(data.result.roles[0].name == "Employee Benefits");
                    assert(data.result.roles[1].id == 6);
                    assert(data.result.roles[1].name == "Payroll");
                    assert(data.result.department.id == 1);
                    assert(data.result.department.name == "Accounting");
                    done();
                })
                .catch(console.error);
        });
    });

    describe("save", function(){
        it("should handle duplicate error", function(done){
            var db = {
                query: function(sql, id, callback){
                    callback({code: "ER_DUP_ENTRY", sqlMessage: "Duplicate error"});
                }
            };

            let serviceProxy = new ServiceProxy(db);
            serviceProxy.save({
                username: "lstooge", first: "Larry", last: "Stooge", email: "larry@stooges.com",
                department: {id: 1}
            }).catch(function(error){
                assert(error != null);
                assert(error.status == 500);
                assert(error.result.code == "ER_DUP_ENTRY");
                assert(error.result.sqlMessage == "Duplicate error");
                done();
            });
        });

        it("should handle sql error", function(done){
            var db = {
                query: function(sql, id, callback){
                    callback({code: "SQL_Error", sqlMessage: "sql error"});
                }
            };

            let serviceProxy = new ServiceProxy(db);
            serviceProxy.save({
                username: "lstooge", first: "Larry", last: "Stooge", email: "larry@stooges.com",
                department: {id: 1}
            }).catch(function(error){
                assert(error != null);
                assert(error.status == 500);
                assert(error.result.code == "SQL_Error");
                assert(error.result.sqlMessage == "sql error");
                done();
            });
        });

        it("should handle insert", function(done){
            var db = {
                query: function(sql, id, callback){
                    callback(null, {insertId: 1});
                }
            };

            let serviceProxy = new ServiceProxy(db);
            serviceProxy.save({
                username: "lstooge", first: "Larry", last: "Stooge", email: "larry@stooges.com",
                department: {id: 1}
            }).then(function(data){
                assert(data != null);
                assert(data.status == 201);
                assert(data.result != null);
                assert(data.result.id == 1);
                done();
            });
        });
    });

    describe("update", function(){
        it("should handle sql error", function(done){
            var db = {
                query: function(sql, data, callback){
                    callback({code: "SQL_Error", sqlMessage: "Some sql error"});
                }
            };

            let serviceProxy = new ServiceProxy(db);
            serviceProxy.updateById(1, {
                username: "lstooge", first: "Larry", last: "Stooge", email: "larry@stooges.com",
                department: {id: 1}
            }).catch(function(error){
                assert(error != null);
                assert(error.status == 500);
                assert(error.result.code == "SQL_Error");
                assert(error.result.sqlMessage == "Some sql error");
                done();
            });
        });

        it("should update a row", function(done){
            var db = {
                query: function(sql, data, callback){
                    callback(null, {affectedRows: 1});
                }
            };
            let serviceProxy = new ServiceProxy(db);
            serviceProxy.updateById(1, {
                username: "lstooge", first: "Larry", last: "Stooge", email: "larry@stooges.com",
                department: {id: 1}
            }).then(function(data){
                assert(data != null);
                assert(data.status == 200);
                assert(data.result != null);
                done();
            });
        });

        it("should not update a row", function(done){
            var db = {
                query: function(sql, data, callback){
                    callback(null, {affectedRows: 0});
                }
            };
            let serviceProxy = new ServiceProxy(db);
            serviceProxy.updateById(1, {
                username: "lstooge", first: "Larry", last: "Stooge", email: "larry@stooges.com",
                department: {id: 1}
            }).catch(function(data){
                assert(data != null);
                assert(data.status == 404);
                assert(data.result.message == "Resource not found");
                done();
            });
        });
    });

    describe("delete", function(){

        it("should handle sql error", function(done){
            var db = {
                query: function(sql, id, callback){
                    callback({code: "SQL_Error", sqlMessage: "sql error"});
                }
            };

            let serviceProxy = new ServiceProxy(db);
            serviceProxy.deleteById(1)
                .catch(function(error, result){
                    assert(error != null);
                    assert(error.status == 500);
                    assert(error.result.sqlMessage == "sql error");
                    assert(result == null);
                    done();
                });
        });

        it("should delete a row", function(done){
            var db = {
                query: function(sql, id, callback){
                    callback(null, {affectedRows: 1});
                }
            };
            let serviceProxy = new ServiceProxy(db);
            serviceProxy.deleteById(1)
                .then(function(data){
                    assert(data != null);
                    assert(data.status == 204);
                    assert(data.result == null);
                    done();
                });
        });

        it("should not delete a row", function(done){
            var db = {
                query: function(sql, id, callback){
                    callback(null, {affectedRows: 0});
                }
            };
            let serviceProxy = new ServiceProxy(db);
            serviceProxy.deleteById(1)
                .catch(function(data){
                    assert(data != null);
                    assert(data.status == 404);
                    assert(data.result.message == "Resource not found");
                    done();
                });
        });
    });
});

