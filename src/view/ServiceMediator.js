//
//  ServiceMediator.js
//  PureMVC JS Demo - EmployeeAdmin Microservice
//
//  Copyright(c) 2023 Saad Shams <saad.shams@puremvc.org>
//  Your reuse is governed by the Creative Commons Attribution 3.0 License
//

import {puremvc} from "../../api/puremvc-2.0.0.js";
import {ApplicationFacade} from "../ApplicationFacade.js";
import {ServiceRequest} from "../model/request/ServiceRequest.js";

export class ServiceMediator extends puremvc.Mediator {

    static NAME = "ServiceMediator";

    constructor(service) {
        super(ServiceMediator.NAME, service);
    }

    onRegister() {
        const self = this;
        function IService() {
            this.service = self.service.bind(self);
        }
        this.viewComponent.setDelegate(new IService());
        this.viewComponent.startup();
    }

    service(request, response, requestData) {
        this.facade.sendNotification(ApplicationFacade.SERVICE, new ServiceRequest(request, response, requestData));
    }

    listNotificationInterests() {
        return [
            ApplicationFacade.SERVICE_RESULT,
            ApplicationFacade.SERVICE_FAULT
        ];
    }

    handleNotification(notification) {
        let serviceRequest = notification.body;
        switch (notification.name) {
            case ApplicationFacade.SERVICE_RESULT:
                this.viewComponent.result(serviceRequest.request, serviceRequest.response, serviceRequest.resultData);
                break;

            case ApplicationFacade.SERVICE_FAULT:
                this.viewComponent.fault(serviceRequest.request, serviceRequest.response, serviceRequest.resultData);
                break;
        }
    }

}