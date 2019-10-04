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
        "CONSUL_HOST": process.env.CONSUL_HOST,
        "CONSUL_PORT": process.env.CONSUL_PORT
    };

    for (let key in env) {
        if(env[key] == null) throw new Error("Please set the " + key + " in env variables and try again.")
    }

    let consul = require("consul")({host: env.CONSUL_HOST, port: env.CONSUL_PORT});

    this.facade.registerProxy(new service.model.ServiceProxy(consul));
    this.facade.registerMediator(new service.view.ServiceMediator(notification.body));
    this.facade.registerCommand(service.ApplicationFacade.SERVICE, service.controller.ServiceCommand);
};

module.exports = StartupCommand;