//
//  ServiceMediator.js
//  PureMVC JS Demo - EmployeeAdmin Microservice
//
//  Copyright(c) 2019 Saad Shams <saad.shams@puremvc.org>
//  Your reuse is governed by the Creative Commons Attribution 3.0 License
//

let puremvc = require("puremvc");
let service = require("../index");

function ServiceMediator(service) {
    puremvc.Mediator.call(this, this.constructor.NAME, service);
}

ServiceMediator.prototype = new puremvc.Mediator;
ServiceMediator.prototype.constructor = ServiceMediator;

ServiceMediator.prototype.onRegister = function() {
    let self = this;
    function IService() {
        this.service = self.service.bind(self);
    }

    this.viewComponent.setDelegate(new IService());
    this.viewComponent.createServer();
};

ServiceMediator.prototype.service = function(request, response, data) {
    let serviceRequest = new service.model.request.ServiceRequest(request, response, data);
    this.facade.sendNotification(service.ApplicationFacade.SERVICE, serviceRequest);
};

ServiceMediator.prototype.listNotificationInterests = function() {
    return [
        service.ApplicationFacade.SERVICE_RESULT,
        service.ApplicationFacade.SERVICE_FAULT
    ];
};

ServiceMediator.prototype.handleNotification = function(notification) {
    let serviceRequest = notification.body;
    switch ((notification.getName())) {
        case service.ApplicationFacade.SERVICE_RESULT:
            this.viewComponent.result(serviceRequest.request, serviceRequest.response, serviceRequest.status, serviceRequest.resultData);
            break;

        case service.ApplicationFacade.SERVICE_FAULT:
            this.viewComponent.fault(serviceRequest.request, serviceRequest.response, serviceRequest.status, serviceRequest.resultData);
            break;
    }
    this.viewComponent.log(serviceRequest.request, serviceRequest.response, serviceRequest.status, serviceRequest.resultData, serviceRequest.requestData);
};

module.exports = ServiceMediator;