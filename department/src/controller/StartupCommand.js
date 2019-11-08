//
//  StartupCommand.js
//  PureMVC JS Demo - EmployeeAdmin Microservice
//
//  Copyright(c) 2019 Saad Shams <saad.shams@puremvc.org>
//  Your reuse is governed by the Creative Commons Attribution 3.0 License
//

let puremvc = require("puremvc");
let service = require("../index");

service.controller.ServiceCommand = require("./ServiceCommand");
service.model.ServiceProxy = require("../model/ServiceProxy");
service.model.request.ServiceRequest = require("../model/request/ServiceRequest");
service.view.ServiceMediator = require("../view/ServiceMediator");

function StartupCommand() {
    puremvc.SimpleCommand.call(this);
}

StartupCommand.prototype = new puremvc.SimpleCommand;
StartupCommand.prototype.constructor = StartupCommand;

StartupCommand.prototype.execute = function(notification) {
    let env = {
        "DATABASE_HOST": process.env.DATABASE_HOST,
        "DATABASE_PORT": process.env.DATABASE_PORT,
        "MYSQL_DATABASE": process.env.MYSQL_DATABASE,
        "MYSQL_USER": process.env.MYSQL_USER,
        "MYSQL_PASSWORD": process.env.MYSQL_PASSWORD,
        "CONSUL_HOST": process.env.CONSUL_HOST,
        "CONSUL_PORT": process.env.CONSUL_PORT,
        "CONSUL_ID": process.env.CONSUL_ID,
        "NODE_PORT": process.env.NODE_PORT || 80
    };

    for (let key in env) {
        if(env[key] == null) throw new Error("Please set the " + key + " in env variables and try again.")
    }

    let db = require("mysql").createPool({
        host: env.DATABASE_HOST,
        port: env.DATABASE_PORT,
        database: env.MYSQL_DATABASE,
        user: env.MYSQL_USER,
        password: env.MYSQL_PASSWORD,
        multipleStatements: true
    });

    this.database(db)
        .then(this.consul.bind(this, env))
        .then(this.cluster.bind(this, db, notification))
        .catch(console.log);
};

StartupCommand.prototype.database = function(db) {
    return new Promise(function (resolve, reject) {
        console.log("Connecting MySQL...");
        let intervalId = setInterval(function(){
            db.query("SELECT 1 FROM dual", function (error) {
                if (error) {
                    console.log("MySQL: " + error.message);
                } else {
                    clearInterval(intervalId);
                    resolve();
                }
            });
        }, 3000);
    });
};

StartupCommand.prototype.consul = function(env) {
    return new Promise(function (resolve) {
        if(!require("cluster").isMaster) return resolve();
        console.log("Connecting Consul...");

        let id = require('crypto').randomBytes(6).toString('hex');
        let service = {
            name: env.CONSUL_ID,
            id: id,
            check: {
                http: "http://" + require("os").hostname() + ":" + env.NODE_PORT + "/health",
                interval: "15s",
                name: env.CONSUL_ID,
                id: id
            }
        };

        let intervalId = setInterval(function(){
            let http = require("http");
            http.request({
                method: "PUT",
                hostname: env.CONSUL_HOST,
                port: env.CONSUL_PORT,
                path: "/v1/agent/service/register",
                headers: {"content-type": "application-json; charset=utf-8"}
            }, function(response){
                if(response.statusCode == 200) {
                    ["exit", "SIGINT", "SIGHUP", "SIGTERM", "SIGQUIT", "SIGUSR1", "SIGUSR2"].forEach(function(value){
                        process.on(value, function(){ // exit close, SIGINT - SIGHUP ctrl+c, SIGTERM kill pid (nodemon restart)
                            http.request({
                                method: "PUT",
                                hostname: env.CONSUL_HOST,
                                port: env.CONSUL_PORT,
                                path: "/v1/agent/service/deregister/" + id
                            }, function(response){}).on("error", function(error){
                                console.log("Consul: " + error.toString());
                            }).end();
                        });
                    });
                    clearInterval(intervalId);
                    resolve();
                } else {
                    console.log(response.statusCode);
                }
            }).on("error", function (error) {
                console.log("Consul: ", error.toString());
            }).end(JSON.stringify(service));
        }, 3000);
    });
};

StartupCommand.prototype.cluster = function(db, notification) {
    let cluster = require("cluster");
    if (!process.env.DEV && cluster.isMaster) {
        require("os").cpus().forEach(function () {
            cluster.fork();
        });
        cluster.on("online", function (worker) {
            console.log("Worker " + worker.process.pid + " is online");
        });
        cluster.on("exit", function (worker, code, signal) {
            console.log("worker", worker.process.pid, "died");
            console.log("Starting a new worker");
            cluster.fork();
        });
    } else {
        this.facade.registerProxy(new service.model.ServiceProxy(db));
        this.facade.registerMediator(new service.view.ServiceMediator(notification.body));
        this.facade.registerCommand(service.ApplicationFacade.SERVICE, service.controller.ServiceCommand);
    }
};

module.exports = StartupCommand;