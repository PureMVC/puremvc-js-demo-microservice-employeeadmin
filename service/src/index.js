//
//  index.js
//  PureMVC JS Demo - EmployeeAdmin Microservice
//
//  Copyright(c) 2019 Saad Shams <saad.shams@puremvc.org>
//  Your reuse is governed by the Creative Commons Attribution 3.0 License
//

let cluster = require("cluster");

if (!process.env.DEV && cluster.isMaster) {

    require("os").cpus().forEach(function(){
        cluster.fork();
    });

    cluster.on("online", function(worker) {
        console.log("Worker " + worker.process.pid + " is online");
    });

    cluster.on("exit", function(worker, code, signal) {
        console.log("worker", worker.process.pid, "died");
        console.log("Starting a new worker");
        cluster.fork();
    });

} else {

    let service = {
        controller: {},
        model: {
            request: {}
        },
        view: {
            components: {}
        }
    };

    module.exports = service;

    let Service = require("./view/components/Service");
    service.ApplicationFacade = require("./ApplicationFacade");
    service.ApplicationFacade.getInstance("service").startup(new Service());
}