//
//  ServiceProxy.js
//  PureMVC JS Demo - EmployeeAdmin Microservice
//
//  Copyright(c) 2023 Saad Shams <saad.shams@puremvc.org>
//  Your reuse is governed by the Creative Commons Attribution 3.0 License
//

import {puremvc} from "../../api/puremvc-2.0.0.js";

export class ServiceProxy extends puremvc.Proxy {

    static NAME = "ServiceProxy";

    constructor(user, role) {
        super(ServiceProxy.NAME, null);
        this.user = user;
        this.role = role;
    }

    findAllUsers() {
        return this.user.findAllUsers();
    }

    findUserById(id) {
        return this.user.findUserById(id);
    }

    save(user) {
        return this.user.saveOrUpdate(user);
    }

    update(user) {
        return this.user.saveOrUpdate(user);
    }

    deleteById(id) {
        return this.user.deleteById(id);
    }

    findAllDepartments() {
        return this.user.findAllDepartments();
    }

    findAllRoles() {
        return this.role.findAllRoles();
    }

}