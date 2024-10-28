//
//  ServiceMediator.js
//  PureMVC JS Demo - EmployeeAdmin Microservice
//
//  Copyright(c) 2023 Saad Shams <saad.shams@puremvc.org>
//  Your reuse is governed by the Creative Commons Attribution 3.0 License
//

import {Mediator} from "@puremvc/puremvc-js-multicore-framework";
import {ServiceProxy} from "../model/ServiceProxy.js";
import {schema} from "../model/graphQL/schema.js";
import {resolvers} from "../model/graphQL/resolvers.js";

export class ServiceMediator extends Mediator {

    static NAME = "ServiceMediator";

    constructor(service) {
        super(ServiceMediator.NAME, service);
    }

    async onRegister() {
        const serviceProxy = /** @type {ServiceProxy} */  this.facade.retrieveProxy(ServiceProxy.NAME);
        await this.component.startup(schema, resolvers(serviceProxy));
    }

    /** @returns {Service} component */
    get component() {
        return this.viewComponent;
    }

}
