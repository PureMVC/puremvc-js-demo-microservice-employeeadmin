//
//  ApplicationFacade.js
//  PureMVC JS Demo - EmployeeAdmin Microservice
//
//  Copyright(c) 2019 Saad Shams <saad.shams@puremvc.org>
//  Your reuse is governed by the Creative Commons Attribution 3.0 License
//

let puremvc = require("puremvc");
let service = require("./index");

service.controller.StartupCommand = require("./controller/StartupCommand");

function ApplicationFacade(multitonKey) {
    puremvc.Facade.call(this, multitonKey);
}

ApplicationFacade.prototype = new puremvc.Facade;
ApplicationFacade.prototype.constructor = ApplicationFacade;

ApplicationFacade.prototype.initializeController = function() {
    puremvc.Facade.prototype.initializeController.call(this);
    this.registerCommand(this.constructor.STARTUP, service.controller.StartupCommand);
};

ApplicationFacade.getInstance = function(multitonKey) {
    if(puremvc.Facade.instanceMap[multitonKey] == null) {
        puremvc.Facade.instanceMap[multitonKey] = new ApplicationFacade(multitonKey);
    }
    return puremvc.Facade.instanceMap[multitonKey];
};

ApplicationFacade.prototype.startup = function(service) {
    this.sendNotification(this.constructor.STARTUP, service);
};

ApplicationFacade.STARTUP = "startup";

ApplicationFacade.SERVICE = "service";
ApplicationFacade.SERVICE_RESULT = "serviceResult";
ApplicationFacade.SERVICE_FAULT = "serviceFault";

module.exports = ApplicationFacade;