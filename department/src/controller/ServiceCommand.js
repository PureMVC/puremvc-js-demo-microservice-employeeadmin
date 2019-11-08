//
//  ServiceCommand.js
//  PureMVC JS Demo - EmployeeAdmin Microservice
//
//  Copyright(c) 2019 Saad Shams <saad.shams@puremvc.org>
//  Your reuse is governed by the Creative Commons Attribution 3.0 License
//

let puremvc = require("puremvc");
let service = require("../index");

function ServiceCommand() {
    puremvc.SimpleCommand.call(this);
}

ServiceCommand.prototype = new puremvc.SimpleCommand;
ServiceCommand.prototype.constructor = ServiceCommand;

ServiceCommand.prototype.execute = function(notification) {
    try {
        let serviceRequest = notification.body;
        let request = notification.body.request;
        let serviceProxy = this.facade.retrieveProxy(service.model.ServiceProxy.NAME);

        switch(require('url').parse(request.url).pathname) {

            case "/departments":
                if(request.method == "GET") {
                    serviceProxy.findAllDepartments()
                        .then(this.result.bind(this, serviceRequest), this.fault.bind(this, serviceRequest));
                } else {
                    this.fault(serviceRequest, {status: 405, result: {code: 405, message: "Method Not Allowed"}});
                }
                break;

            case "/health":
                this.result(serviceRequest, {status: 200});
                break;

            default:
                this.fault(serviceRequest, {status: 405, result: {code: 405, message: "Method Not Allowed"}});

        }
    } catch(error) {
        this.fault(notification.body, {status: 500, result: error});
    }
};

ServiceCommand.prototype.result = function(serviceRequest, data) {
    serviceRequest.setResultData(data.status, data.result);
    this.facade.sendNotification(service.ApplicationFacade.SERVICE_RESULT, serviceRequest);
};

ServiceCommand.prototype.fault = function(serviceRequest, data) {
    serviceRequest.setResultData(data.status, data.result);
    this.facade.sendNotification(service.ApplicationFacade.SERVICE_FAULT, serviceRequest);
};

module.exports = ServiceCommand;