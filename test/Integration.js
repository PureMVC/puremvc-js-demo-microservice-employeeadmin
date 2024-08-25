//
//  Integration.js
//  PureMVC JS Demo - EmployeeAdmin Microservice
//
//  Copyright(c) 2023 Saad Shams <saad.shams@puremvc.org>
//  Your reuse is governed by the Creative Commons Attribution 3.0 License
//

import assert from "node:assert";
import {describe, test} from "node:test";
import http from "node:http";

describe("API Integration", () => {

    test("/users-bad-request", () => {
        return new Promise((resolve, reject) => {
            http.request({
                method: "POST", hostname: "127.0.0.1", path: "/users",
                headers: { "Content-Type": "application/json" }
            }, response => {
                let buffers = [];
                response.on("data", data => buffers.push(data));
                response.on("end", () => {
                    assert(response.statusCode === 400);
                    resolve();
                });
            }).on("error", reject).end('{"first":"Shemp","last":"Stooge"'); // missing }
        });
    });

    test("/users", () => {
        return new Promise((resolve, reject) => {
            http.request({
                method: "GET", hostname: "127.0.0.1", path: "/users"
            }, response => {
                let buffers = [];
                response.on("data", data => buffers.push(data));
                response.on("end", () => {
                    try {
                        JSON.parse(Buffer.concat(buffers).toString());
                        assert(response.statusCode === 200);
                        resolve();
                    } catch(error) { reject(error); }
                });
            }).on("error", reject).end();
        });
    });

    test("/roles", () => {
        return new Promise((resolve, reject) => {
            http.request({
                method: "GET", hostname: "127.0.0.1", path: "/roles"
            }, response => {
                let buffers = [];
                response.on("data", data => buffers.push(data));
                response.on("end", () => {
                    try {
                        JSON.parse(Buffer.concat(buffers).toString());
                        assert(response.statusCode === 200);
                        resolve();
                    } catch(error) { reject(error); }
                });
            }).on("error", reject).end();
        });
    });

    test("/departments", () => {
        return new Promise((resolve, reject) => {
            http.request({
                method: "GET", hostname: "localhost", path: "/departments"
            }, response => {
                let buffers = [];
                response.on("data", data => buffers.push(data));
                response.on("end", () => {
                    try {
                        let d = JSON.parse(Buffer.concat(buffers).toString());
                        assert(response.statusCode === 200);
                        resolve();
                    } catch(error) { reject(error) }
                });
            }).on("error", reject).end();
        });
    });

    test("create and delete", () => {
        return new Promise((resolve, reject) => {

            let shemp = {
                username: "sshemp-" + Math.random(), first: "Shemp", last: "Stooge", email: "sshemp@stooges.com",
                password: "ghi123", department: { id: 2, name: "Sales" }
            };

            http.request({
                method: "POST", hostname: "127.0.0.1", path: "/users",
                headers: { "Content-Type": "application/json" }
            }, response => {
                let buffers = [];
                response.on("data", data => buffers.push(data));
                response.on("end", () => {
                    try {
                        let body = JSON.parse(Buffer.concat(buffers).toString());
                        if (response.statusCode !== 201) {
                            reject(body);
                        } else {
                            http.request({
                                method: "DELETE", hostname: "127.0.0.1", path: "/users/" + body.id
                            }, (response) => {
                                let buffers = [];
                                response.on("data", data => buffers.push(data));
                                response.on('end', () => {
                                    resolve();
                                });
                            }).on("error", reject).end();
                        }
                    } catch(error) {
                        reject(error);
                    }
                });
            }).on("error", reject).end(JSON.stringify(shemp));
        });
    });

    test("create, verify roles and delete", () => {
        return new Promise((resolve, reject) => {

            let shemp = {
                username: "sshemp-" + Math.random(), first: "Shemp", last: "Stooge", email: "sshemp@stooges.com",
                password: "ghi123", department: { id: 2, name: "Sales" },
                roles: [{id: 2, name: "Accounts Payable"}]
            };

            http.request({ // POST
                method: "POST", hostname: "127.0.0.1", path: "/users",
                headers: { "Content-Type": "application/json" }
            }, response => {
                let buffers = [];
                response.on("data", data => buffers.push(data));
                response.on("end", () => {
                    let user = JSON.parse(Buffer.concat(buffers).toString());
                    if (response.statusCode !== 201) {
                        reject(user);
                    } else {

                        http.request({ // GET
                            method: "GET", hostname: "127.0.0.1", path: "/users/" + user.id
                        }, response => {
                            let buffers = [];
                            response.on("data", data => buffers.push(data));
                            response.on("end", () => {
                                let user = JSON.parse(Buffer.concat(buffers).toString());
                                if (response.statusCode !== 200) {
                                    reject(user);
                                } else {
                                    assert(user.roles.length === 1);
                                    assert(user.roles[0].id === 2);

                                    http.request({ // DELETE
                                        method: "DELETE", hostname: "127.0.0.1", path: "/users/" + user.id
                                    }, (response) => {
                                        let buffers = [];
                                        response.on("data", data => buffers.push(data));
                                        response.on("end", () => {
                                            if (response.statusCode === 204)
                                                resolve();
                                            else reject();
                                        });
                                    }).on("error", reject).end();

                                }
                            });
                        }).on("error", reject).end();
                    }
                });
            }).on("error", reject).end(JSON.stringify(shemp));
        });
    });

});
