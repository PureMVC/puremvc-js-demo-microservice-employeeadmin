//
//  ApplicationFacade.js
//  PureMVC JS Demo - EmployeeAdmin Microservice
//
//  Copyright(c) 2023 Saad Shams <saad.shams@puremvc.org>
//  Your reuse is governed by the Creative Commons Attribution 3.0 License
//

import {puremvc} from "../api/puremvc-2.0.0.js";
import {StartupCommand} from "./controller/StartupCommand.js";

export class ApplicationFacade extends puremvc.Facade {

    static get STARTUP() { return "startup"; }
    static get SERVICE() { return "service"; }
    static get SERVICE_RESULT() { return "service_result"; }
    static get SERVICE_FAULT() { return "service_fault"; }

    constructor(multitonKey) {
        super(multitonKey);
    }

    initializeController() {
        super.initializeController();
        this.registerCommand(ApplicationFacade.STARTUP, () => new StartupCommand());
    }

    static getInstance(multitonKey) {
        return puremvc.Facade.getInstance(multitonKey, k => new ApplicationFacade(k));
    }

    startup() {
        this.sendNotification(ApplicationFacade.STARTUP);
    }
}

