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

            case "/employees":
                if(request.method == "GET") {
                    serviceProxy.getAgent("employee")
                        .then(serviceProxy.findAllUsers.bind(serviceProxy))
                        .then(this.result.bind(this, serviceRequest), this.fault.bind(this, serviceRequest));
                } else if(request.method == "POST") {
                    serviceProxy.getAgent("employee")
                        .then(serviceProxy.saveUser.bind(serviceProxy, serviceRequest.requestData))
                        .then(this.result.bind(this, serviceRequest), this.fault.bind(this, serviceRequest));
                } else {
                    this.fault(serviceRequest, {status: 405, result: {code: 405, message: "Method Not Allowed"}});
                }
                break;

            case "/departments":
                if(request.method == "GET") {
                    serviceProxy.getAgent("department")
                        .then(serviceProxy.findAllDepartments.bind(serviceProxy))
                        .then(this.result.bind(this, serviceRequest), this.fault.bind(this, serviceRequest));
                } else {
                    this.fault(serviceRequest, {status: 405, result: {code: 405, message: "Method Not Allowed"}});
                }
                break;

            default:
                var matches;
                if(matches = request.url.match(/\/employees\/(\d+)\/roles/)) { // employees/:id/roles

                    if(request.method == "GET") {
                        serviceProxy.getAgent("role")
                            .then(serviceProxy.getUserRolesById.bind(serviceProxy, parseInt(matches[1]))) // getUserRolesById(parseInt(matches[1]))
                            .then(this.result.bind(this, serviceRequest), this.fault.bind(this, serviceRequest));
                    } else if(request.method == "PUT") {
                        serviceProxy.getAgent("role")
                            .then(serviceProxy.updateUserRolesById.bind(serviceProxy, parseInt(matches[1]), serviceRequest.requestData))
                            .then(this.result.bind(this, serviceRequest), this.fault.bind(this, serviceRequest));
                    } else {
                        this.fault(serviceRequest, {status: 405, result: {code: 405, message: "Method Not Allowed"}});
                    }

                } else if(matches = request.url.match(/\/employees\/(\d+)/)) { // employees/:id

                    if(request.method == "GET") {
                        serviceProxy.getAgent("employee")
                            .then(serviceProxy.getUserById.bind(serviceProxy, parseInt(matches[1])))
                            .then(this.result.bind(this, serviceRequest), this.fault.bind(this, serviceRequest));
                    } else if(request.method == "PUT") {
                        serviceProxy.getAgent("employee")
                            .then(serviceProxy.updateUser.bind(serviceProxy, parseInt(matches[1]), serviceRequest.requestData))
                            .then(this.result.bind(this, serviceRequest), this.fault.bind(this, serviceRequest));
                    } else if(request.method == "DELETE") {
                        serviceProxy.getAgent("employee")
                            .then(serviceProxy.deleteUser.bind(serviceProxy, parseInt(matches[1])))
                            .then(this.result.bind(this, serviceRequest), this.fault.bind(this, serviceRequest));
                    } else {
                        this.fault(serviceRequest, {status: 405, result: {code: 405, message: "Method Not Allowed"}});
                    }

                } else {
                    this.fault(serviceRequest, {status: 405, result: {code: 405, message: "Method Not Allowed"}});
                }

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