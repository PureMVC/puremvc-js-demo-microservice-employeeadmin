//
//  ServiceMediator.js
//  PureMVC JS Demo - EmployeeAdmin Microservice
//
//  Copyright(c) 2023 Saad Shams <saad.shams@puremvc.org>
//  Your reuse is governed by the Creative Commons Attribution 3.0 License
//

import {Mediator} from "@puremvc/puremvc-js-multicore-framework";
import {ApplicationFacade} from "../ApplicationFacade.js";
import { EventEmitter } from "events";

export class ServiceMediator extends Mediator {

    static NAME = "ServiceMediator";

    handler = ({request, response, requestData}) => {
        this.service(request, response, requestData);
    }

    constructor(service) {
        super(ServiceMediator.NAME, service);
    }

    onRegister() {
        this.emitter = new EventEmitter();
        this.emitter.on("service", this.handler);
        this.viewComponent.startup(this.emitter);
    }

    onRemove() {
        this.emitter.off("service", this.handler);
    }

    service(request, response, requestData) {
        this.facade.sendNotification(ApplicationFacade.SERVICE, {request, response, requestData});
    }

    listNotificationInterests() {
        return [
            ApplicationFacade.SERVICE_RESULT,
            ApplicationFacade.SERVICE_FAULT
        ];
    }

    handleNotification(notification) {
        const { request, response, resultData } = notification.body;
        switch (notification.name) {
            case ApplicationFacade.SERVICE_RESULT:
                this.viewComponent.result(request, response, resultData);
                break;

            case ApplicationFacade.SERVICE_FAULT:
                this.viewComponent.fault(request, response, resultData);
                break;
        }
    }

}
