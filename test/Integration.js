//
//  Integration.js
//  PureMVC JS Demo - EmployeeAdmin Microservice
//
//  Copyright(c) 2023 Saad Shams <saad.shams@puremvc.org>
//  Your reuse is governed by the Creative Commons Attribution 3.0 License
//

import assert from "node:assert";
import {describe, test} from "node:test";
import https from "node:https";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

let xtest = (name, callback) => {}

describe("API Integration", () => {

    test("/employees-bad-request", () => {
        return new Promise((resolve, reject) => {
            https.request({
                method: "POST", hostname: "localhost", port: 443, path: "/employees",
                headers: { "Content-Type": "application/json" }
            }, response => {
                let buffers = [];
                response.on("data", buffers.push.bind(buffers));
                response.on("end", () => {
                    assert(response.statusCode === 400);
                    resolve();
                });
            }).on("error", reject).end('{"first":"Shemp","last":"Stooge"');
        });
    });

    test("/employees", () => {
        return new Promise((resolve, reject) => {
            https.request({
                method: "GET", hostname: "localhost", port: 443, path: "/employees"
            }, response => {
                let buffers = [];
                response.on("data", buffers.push.bind(buffers));
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
            https.request({
                method: "GET", hostname: "localhost", port: 443, path: "/roles"
            }, response => {
                let buffers = [];
                response.on("data", buffers.push.bind(buffers));
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
            https.request({
                method: "GET", hostname: "localhost", port: 443, path: "/departments"
            }, response => {
                let buffers = [];
                response.on("data", buffers.push.bind(buffers));
                response.on("end", () => {
                    try {
                        JSON.parse(Buffer.concat(buffers).toString());
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

            https.request({
                method: "POST", hostname: "localhost", port: 443, path: "/employees",
                headers: { "Content-Type": "application/json" }
            }, response => {
                let buffers = [];
                response.on("data", buffers.push.bind(buffers));
                response.on("end", () => {
                    try {
                        let body = JSON.parse(Buffer.concat(buffers).toString());
                        if (response.statusCode !== 201) {
                            reject(body);
                        } else {
                            https.request({
                                method: "DELETE", hostname: "localhost", port: 443, path: "/employees/" + body.id
                            }, (response) => {
                                let buffers = [];
                                response.on("data", buffers.push.bind(buffers));
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

            https.request({ // POST
                method: "POST", hostname: "localhost", port: 443, path: "/employees",
                headers: { "Content-Type": "application/json" }
            }, response => {
                let buffers = [];
                response.on("data", buffers.push.bind(buffers));
                response.on("end", () => {
                    let user = JSON.parse(Buffer.concat(buffers).toString());
                    if (response.statusCode !== 201) {
                        reject(user);
                    } else {

                        https.request({ // GET
                            method: "GET", hostname: "localhost", port: 443, path: "/employees/" + user.id
                        }, response => {
                            let buffers = [];
                            response.on("data", buffers.push.bind(buffers));
                            response.on("end", () => {
                                let user = JSON.parse(Buffer.concat(buffers).toString());
                                if (response.statusCode !== 200) {
                                    reject(user);
                                } else {
                                    assert(user.roles.length === 1);
                                    assert(user.roles[0].id === 2);

                                    https.request({ // DELETE
                                        method: "DELETE", hostname: "localhost", port: 443, path: "/employees/" + user.id
                                    }, (response) => {
                                        let buffers = [];
                                        response.on("data", buffers.push.bind(buffers));
                                        response.on('end', () => {
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
