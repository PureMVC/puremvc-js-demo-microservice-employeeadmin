//
//  ServiceCommand.js
//  PureMVC JS Demo - EmployeeAdmin Microservice
//
//  Copyright(c) 2023 Saad Shams <saad.shams@puremvc.org>
//  Your reuse is governed by the Creative Commons Attribution 3.0 License
//

import {puremvc} from "../../api/puremvc-2.0.0.js";
import {ApplicationFacade} from "../ApplicationFacade.js";
import {ServiceProxy} from "../model/ServiceProxy.js";

import {URL} from "url";

export class ServiceCommand extends puremvc.SimpleCommand {

    execute(notification) {
        const serviceRequest = notification.body;
        const request = serviceRequest.request;
        const serviceProxy = this.facade.retrieveProxy(ServiceProxy.NAME);

        try {
            switch (new URL(request.url, "https://puremvc.org").pathname) {
                case "/employees":
                    if (request.method === "GET") {
                        serviceProxy.findAllUsers()
                            .then(this.result.bind(this, serviceRequest), this.fault.bind(this, serviceRequest));
                    }  else if (request.method === "POST") {
                        serviceProxy.save(serviceRequest.requestData)
                            .then(this.result.bind(this, serviceRequest), this.fault.bind(this, serviceRequest));
                    }
                    break;
                case "/departments":
                    serviceProxy.findAllDepartments()
                        .then(this.result.bind(this, serviceRequest), this.fault.bind(this, serviceRequest));
                    break;
                case "/roles":
                    serviceProxy.findAllRoles()
                        .then(this.result.bind(this, serviceRequest), this.fault.bind(this, serviceRequest));
                    break;
                default:
                    let matches = request.url.match(/^\/employees\/(\d+)$/); // employees/:id
                    if (matches) {
                        if (request.method === "GET") {
                            serviceProxy.findUserById(matches[1])
                                .then(this.result.bind(this, serviceRequest), this.fault.bind(this, serviceRequest));
                        } else if (request.method === "UPDATE") {
                            serviceProxy.update(serviceRequest.requestData)
                                .then(this.result.bind(this, serviceRequest), this.fault.bind(this, serviceRequest));
                        } else if (request.method === "DELETE") {
                            serviceProxy.deleteById(parseInt(matches[1]))
                                .then(this.result.bind(this, serviceRequest), this.fault.bind(this, serviceRequest));
                        }
                    }
                    break;
            }
        } catch (error) {
            this.fault(serviceRequest, {status: 500, result: error});
        }
    }

    result(serviceRequest, resultData) {
        serviceRequest.resultData = resultData;
        this.facade.sendNotification(ApplicationFacade.SERVICE_RESULT, serviceRequest);
    }

    fault(serviceRequest, resultData) {
        serviceRequest.resultData = resultData;
        this.facade.sendNotification(ApplicationFacade.SERVICE_FAULT, serviceRequest);
    }

}
