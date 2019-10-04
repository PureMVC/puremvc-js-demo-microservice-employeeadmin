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
        "DATABASE_NAME": process.env.DATABASE_NAME,
        "DATABASE_USER": process.env.DATABASE_USER,
        "DATABASE_PASSWORD": process.env.DATABASE_PASSWORD
    };

    for (let key in env) {
        if(env[key] == null) throw new Error("Please set the " + key + " in env variables and try again.")
    }

    let db = require("mysql").createPool({
        host: env.DATABASE_HOST,
        port: env.DATABASE_PORT,
        database: env.DATABASE_NAME,
        user: env.DATABASE_USER,
        password: env.DATABASE_PASSWORD,
        multipleStatements: true
    });

    let self = this;
    let intervalId = setInterval(function(){
        db.query("SELECT 1 FROM dual", function (error) {
            if (error) {
                console.log("Waiting for Database to be loaded.");
            } else {
                console.log("Connected to Database.");
                clearInterval(intervalId);

                self.facade.registerProxy(new service.model.ServiceProxy(db));
                self.facade.registerMediator(new service.view.ServiceMediator(notification.body));
                self.facade.registerCommand(service.ApplicationFacade.SERVICE, service.controller.ServiceCommand);
            }
        });
    }, 3000);

};

module.exports = StartupCommand;