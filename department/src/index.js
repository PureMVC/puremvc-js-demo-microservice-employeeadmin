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

    let env = {
        "CONSUL_HOST": process.env.CONSUL_HOST,
        "CONSUL_PORT": process.env.CONSUL_PORT,
        "CONSUL_ID": process.env.CONSUL_ID
    };

    for (let key in env) {
        if(env[key] == null) throw new Error("Please set the " + key + " in env variables and try again.")
    }

    let consul = require("consul")({host: env.CONSUL_HOST, port: env.CONSUL_PORT});
    consul.agent.check.register({
        id: env.CONSUL_ID,
        name: require("os").hostname(),
        ttl: "15s",
        http: "http://" + require("os").hostname() + ":3000/health",
        check: "http",
        interval: "15s"
    }, function (error) {
        if(error) {
            throw error;
        } else {
            console.log("Registered with Consul.");

            // exit close, SIGINT - SIGHUP ctrl+c, SIGTERM kill pid (nodemon restart)
            ["exit", "SIGINT", "SIGHUP", "SIGTERM", "SIGQUIT", "SIGUSR1", "SIGUSR2", "uncaughtException"].forEach(function(value){
                process.on(value, function(){
                    consul.agent.check.deregister(env.CONSUL_ID, function(error) {
                        if (error) throw error;
                        console.log("DeRegistered with Consul.");
                        process.exit(1);
                    });
                })
            });
        }
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