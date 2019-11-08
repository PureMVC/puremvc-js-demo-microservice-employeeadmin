//
//  Integration.js
//  PureMVC JS Demo - EmployeeAdmin Microservice
//
//  Copyright(c) 2019 Saad Shams <saad.shams@puremvc.org>
//  Your reuse is governed by the Creative Commons Attribution 3.0 License
//

let assert = require("assert");
let http = require("http");

describe("Integration", function() {

    describe("GET /users", function() {
        it("should return list of users", function(done) {
            http.request({
                method: "GET",
                hostname: "localhost",
                port: 3000,
                path: "/employees"
            }, function(response){
                let buffers = [];
                response.on("data", buffers.push.bind(buffers));
                response.on("end", function(){
                    try {
                        let body = JSON.parse(Buffer.concat(buffers).toString());
                        assert(response.statusCode == 200);
                        done();
                    } catch(error) {
                        console.error(error);
                    }
                });
            }).on("error", console.error).end();
        });

        it("should return a specific user", function(done) {
            http.request({
                method: "GET",
                hostname: "localhost",
                port: 3000,
                path: "/employees/1"
            }, function(response){
                let buffers = [];
                response.on("data", buffers.push.bind(buffers));
                response.on("end", function(){
                    try {
                        let body = JSON.parse(Buffer.concat(buffers).toString());
                        assert(response.statusCode == 200);
                        done();
                    } catch(error) {
                        console.error(error);
                    }
                });
            }).on("error", console.error).end();
        });

        it("should insert, update and delete a user", function(done) {
            let shemp = {
                username: "sshemp",
                first: "Shemp",
                last: "Stooge",
                email: "sshemp@stooges.com",
                department: {
                    id: 2,
                    name: "Sales"
                },
                id: 4
            };
            http.request({
                method: "POST",
                hostname: "localhost",
                port: 3000,
                path: "/employees",
                headers: {
                    "content-type": "application/json"
                }
            }, function(response){
                let buffers = [];
                response.on("data", buffers.push.bind(buffers));
                response.on("end", function(){
                    try {
                        let body = JSON.parse(Buffer.concat(buffers).toString());
                        assert(response.statusCode == 201);
                        assert(response.headers.location != null);
                        let location = response.headers.location;

                        shemp.first = "Shemp2"; // update
                        http.request({
                            method: "PUT",
                            hostname: "localhost",
                            port: 3000,
                            path: location,
                            headers: {
                                "content-type": "application/json"
                            }
                        }, function(response){
                            let buffers = [];
                            response.on("data", buffers.push.bind(buffers));
                            response.on("end", function(){
                                try {
                                    assert(response.statusCode == 200);
                                    http.request({ // delete
                                        method: "DELETE",
                                        hostname: "localhost",
                                        port: 3000,
                                        path: location
                                    }, function(response){
                                        let buffers = [];
                                        response.on("data", buffers.push.bind(buffers));
                                        response.on("end", function(){
                                            try {
                                                assert(response.statusCode == 204);
                                                done();
                                            } catch(error) {
                                                console.error(error);
                                            }
                                        });
                                    }).on("error", console.error).end();

                                } catch(error) {
                                    console.error(error);
                                }
                            });
                        }).on("error", console.error).end(JSON.stringify(shemp));
                    } catch(error) {
                        console.error(error);
                    }
                });
            }).on("error", console.error).end(JSON.stringify(shemp));
        });
    });

    describe("GET /role", function() {
        it("should return list of user roles", function(done) {
            http.request({
                method: "GET",
                hostname: "localhost",
                port: 3000,
                path: "/employees/1/roles"
            }, function(response){
                let buffers = [];
                response.on("data", buffers.push.bind(buffers));
                response.on("end", function(){
                    try {
                        let body = JSON.parse(Buffer.concat(buffers).toString());
                        assert(response.statusCode == 200);
                        done();
                    } catch(error) {
                        console.error(error);
                    }
                });
            }).on("error", console.error).end();
        });

        it("should update user roles", function(done) {
            let roles = [7, 8, 9];
            http.request({
                method: "PUT",
                hostname: "localhost",
                port: 3000,
                path: "/employees/1/roles",
                headers: {
                    "content-type": "application/json"
                }
            }, function(response){
                let buffers = [];
                response.on("data", buffers.push.bind(buffers));
                response.on("end", function(){
                    try {
                        let body = JSON.parse(Buffer.concat(buffers).toString());
                        assert(response.statusCode == 200);
                        done();
                    } catch(error) {
                        console.error(error);
                    }
                });
            }).on("error", console.error).end(JSON.stringify(roles));
        });
    });

    describe("GET /department", function() {
        it("should return list of departments", function(done) {
            http.request({
                method: "GET",
                hostname: "localhost",
                port: 3000,
                path: "/departments"
            }, function(response){
                let buffers = [];
                response.on("data", buffers.push.bind(buffers));
                response.on("end", function(){
                    try {
                        let body = JSON.parse(Buffer.concat(buffers).toString());
                        assert(response.statusCode == 200);
                        done();
                    } catch(error) {
                        console.error(error);
                    }
                });
            }).on("error", console.error).end();
        });
    });

});