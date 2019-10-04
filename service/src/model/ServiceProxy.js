//
//  ServiceProxy.js
//  PureMVC JS Demo - EmployeeAdmin Microservice
//
//  Copyright(c) 2019 Saad Shams <saad.shams@puremvc.org>
//  Your reuse is governed by the Creative Commons Attribution 3.0 License
//

let puremvc = require("puremvc");
let http = require('http');
let consul;

function ServiceProxy($consul) {
    puremvc.Proxy.call(this, this.constructor.NAME, null);
    consul = $consul;
}

ServiceProxy.prototype = new puremvc.Proxy;
ServiceProxy.prototype.constructor = ServiceProxy;

// get agent's hostname
ServiceProxy.prototype.getAgent = function(id) {
    return new Promise(function (resolve, reject) {
        consul.agent.check.list(function(error, result) {
            if (error) {
                reject(error);
            } else {
                for (let key in result) {
                    if(key == id) {
                        resolve(result[key].Name);
                        return;
                    }
                }
                reject({status: 500, result: {code: 500, message: "Service lookup failed."}});
            }
        });
    });
};

// find all users
ServiceProxy.prototype.findAllUsers = function(hostname) {
    return new Promise(function (resolve, reject) {
        http.request({
            method: "GET",
            hostname: hostname,
            port: 3000,
            path: "/employees"
        }, function(response){
            let buffers = [];
            response.on("data", buffers.push.bind(buffers));
            response.on("end", function(){
                let data = {status: response.statusCode, result: JSON.parse(Buffer.concat(buffers).toString())};
                response.statusCode == 200 ? resolve(data) : reject(data);
            });
        }).on("error", function(error){
            reject({status: 500, result: error});
        }).end();
    });
};

// get a user by id
ServiceProxy.prototype.getUserById = function(id) {
    return new Promise(function (resolve, reject) {
        http.request({
            method: "GET",
            hostname: "employee",
            port: 3000,
            path: "/employees/" + id
        }, function(response){
            let buffers = [];
            response.on("data", buffers.push.bind(buffers));
            response.on("end", function(){
                let data = {status: response.statusCode, result: JSON.parse(Buffer.concat(buffers).toString())};
                response.statusCode == 200 ? resolve(data) : reject(data);
            });
        }).on("error", function(error){
            reject({status: 500, result: error});
        }).end();
    });
};

// add a user to the database
ServiceProxy.prototype.saveUser = function(data, hostname) {
    return new Promise(function (resolve, reject) {
        http.request({
            method: "POST",
            hostname: hostname,
            port: 3000,
            path: "/employees",
            headers: {
                "content-type": "application/json"
            }
        }, function(response){
            let buffers = [];
            response.on("data", buffers.push.bind(buffers));
            response.on("end", function(){
                let data = {status: response.statusCode, result: JSON.parse(Buffer.concat(buffers).toString())};
                response.statusCode == 201 ? resolve(data) : reject(data);
            });
        }).on("error", function(error){
            reject({status: 500, result: error});
        }).end(JSON.stringify(data));
    });
};

// update a user in the database
ServiceProxy.prototype.updateUser = function(id, data) {
    return new Promise(function (resolve, reject) {
        http.request({
            method: "PUT",
            hostname: "employee",
            port: 3000,
            path: "/employees/" + id,
            headers: {
                "content-type": "application/json"
            }
        }, function(response){
            let buffers = [];
            response.on("data", buffers.push.bind(buffers));
            response.on("end", function(){
                let data = {status: response.statusCode, result: JSON.parse(Buffer.concat(buffers).toString())};
                response.statusCode == 200 ? resolve(data) : reject(data);
            });
        }).on("error", function(error){
            reject({status: 500, result: error});
        }).end(JSON.stringify(data));
    });
};

// delete a user from the data
ServiceProxy.prototype.deleteUser = function(id) {
    return new Promise(function (resolve, reject) {
        http.request({
            method: "DELETE",
            hostname: "employee",
            port: 3000,
            path: "/employees/" + id
        }, function(response){
            let buffers = [];
            response.on("data", buffers.push.bind(buffers));
            response.on("end", function(){
                if(response.statusCode == 204) {
                    resolve({status: response.statusCode});
                } else {
                    reject({status: response.statusCode, result: JSON.parse(Buffer.concat(buffers).toString())});
                }
            });
        }).on("error", function(error){
            reject({status: 500, result: error});
        }).end();
    });
};

// get user roles
ServiceProxy.prototype.getUserRolesById = function(id, hostname) {
    return new Promise(function (resolve, reject) {
        http.request({
            method: "GET",
            hostname: hostname,
            port: 3000,
            path: "/employees/" + id + "/roles"
        }, function(response){
            let buffers = [];
            response.on("data", buffers.push.bind(buffers));
            response.on("end", function(){
                let data = {status: response.statusCode, result: JSON.parse(Buffer.concat(buffers).toString())};
                response.statusCode == 200 ? resolve(data) : reject(data);
            });
        }).on("error", function(error){
            reject({status: 500, result: error});
        }).end();
    });
};

// add roles to this user
ServiceProxy.prototype.updateUserRolesById = function(id, data, hostname) {
    return new Promise(function (resolve, reject) {
        http.request({
            method: "PUT",
            hostname: hostname,
            port: 3000,
            path: "/employees/" + id + "/roles",
            headers: {
                "content-type": "application/json"
            }
        }, function(response){
            let buffers = [];
            response.on("data", buffers.push.bind(buffers));
            response.on("end", function(){
                let data = {status: response.statusCode, result: JSON.parse(Buffer.concat(buffers).toString())};
                response.statusCode == 200 ? resolve(data) : reject(data);
            });
        }).on("error", function(error){
            reject({status: 500, result: error});
        }).end(JSON.stringify(data));
    });
};

// get departments
ServiceProxy.prototype.findAllDepartments = function(hostname) {
    return new Promise(function (resolve, reject) {
        http.request({
            method: "GET",
            hostname: hostname,
            port: 3000,
            path: "/departments"
        }, function(response){
            let buffers = [];
            response.on("data", buffers.push.bind(buffers));
            response.on("end", function(){
                let data = {status: response.statusCode, result: JSON.parse(Buffer.concat(buffers).toString())};
                response.statusCode == 200 ? resolve(data) : reject(data);
            });
        }).on("error", function(error){
            reject({status: 500, result: error});
        }).end();
    });
};

ServiceProxy.NAME = "ServiceProxy";

module.exports = ServiceProxy;