//
//  ServiceCommand.js
//  PureMVC JS Demo - EmployeeAdmin Microservice
//
//  Copyright(c) 2023 Saad Shams <saad.shams@puremvc.org>
//  Your reuse is governed by the Creative Commons Attribution 3.0 License
//

import {SimpleCommand} from "@puremvc/puremvc-js-multicore-framework";
import {ApplicationFacade} from "../ApplicationFacade.js";
import {ServiceProxy} from "../model/ServiceProxy.js";

import {URL} from "url";

export class ServiceCommand extends SimpleCommand {

    async execute(notification) {
        const {request, response, requestData} = notification.body;
        const { method, url } = request;
        const serviceProxy = this.facade.retrieveProxy(ServiceProxy.NAME);
        let resultData;

        try {
            switch (new URL(url, "https://puremvc.org").pathname) {
                case "/users":
                    if (method === "GET") {
                        resultData = await serviceProxy.findAllUsers();
                    } else if (method === "POST") {
                        resultData = await serviceProxy.add(requestData);
                    } else if (method === "PUT") {
                        resultData = await serviceProxy.update(requestData);
                    }
                    break;
                case "/departments":
                    resultData = await serviceProxy.findAllDepartments();
                    break;
                case "/roles":
                    resultData = await serviceProxy.findAllRoles();
                    break;
                default:
                    let users = url.match(/^\/users\/(\d+)$/); // matches employees/:id
                    let userRoles = url.match(/^\/users\/(\d+)\/roles$/); // matches employees/:id/roles

                    if (users) {
                        if (method === "GET") {
                            resultData = await serviceProxy.findUserById(users[1])
                        } else if (method === "PUT") {
                            resultData = await serviceProxy.update(requestData);
                        } else if (method === "DELETE") {
                            resultData = await serviceProxy.deleteById(parseInt(users[1]));
                        } else {
                            resultData = {status: 404, body: {code: 404, message: "Resource not found" }};
                        }
                    } else if (userRoles) {
                        if (method === "GET") {
                            resultData = await serviceProxy.findRolesById(userRoles[1]);
                        } else if (method === "PUT") {
                            resultData = await serviceProxy.updateRolesById(userRoles[1], requestData);
                        } else {
                            resultData = {status: 404, body: {code: 404, message: "Resource not found" }};
                        }
                    } else {
                        resultData = {status: 404, body: {code: 404, message: "Resource not found" }};
                    }
                    break;
            }
        } catch (error) {
            this.fault(request, response, error);
            return;
        }

        this.result(request, response, resultData);
    }

    result(request, response, resultData) {
        this.facade.sendNotification(ApplicationFacade.SERVICE_RESULT, {request, response, resultData});
    }

    fault(request, response, resultData) {
        this.facade.sendNotification(ApplicationFacade.SERVICE_FAULT, {request, response, resultData});
    }

}
