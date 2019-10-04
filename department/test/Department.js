//
//  Department.js
//  PureMVC JS Demo - EmployeeAdmin Microservice
//
//  Copyright(c) 2019 Saad Shams <saad.shams@puremvc.org>
//  Your reuse is governed by the Creative Commons Attribution 3.0 License
//

let assert = require("assert");

describe("Department", function(){

    let ServiceProxy = require("../src/model/ServiceProxy");

    describe("findAllDepartments", function(){

        it("should handle sql error", function(done){
            let db = {
                query: function(sql, callback){
                    callback({sqlMessage: "sql error"});
                }
            };

            let serviceProxy = new ServiceProxy(db);
            serviceProxy.findAllDepartments()
                .catch(function(error){
                    assert(error != null);
                    assert(error.status == 500);
                    assert(error.result.message = "sql error");
                    done();
                });
        });

        it("should return department list", function(done){
            let db = {
                query: function(sql, callback){
                    callback(null, [
                        {id: 1, name: "Accounting"}, {id: 2, name: "Sales"}, {id: 3, name: "Plant"},
                        {id: 4, name: "Shipping"}, {id: 5, name: "Quality Control"}
                    ]);
                }
            };

            let serviceProxy = new ServiceProxy(db);
            serviceProxy.findAllDepartments()
                .then(function(data){
                    assert(data.status == 200);
                    assert(data.result != null);
                    assert(data.result.length == 5);
                    done();
                })
                .catch(console.error);
        });
    });
});