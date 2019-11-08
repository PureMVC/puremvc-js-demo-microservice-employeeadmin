//
//  index.js
//  PureMVC JS Demo - EmployeeAdmin Microservice
//
//  Copyright(c) 2019 Saad Shams <saad.shams@puremvc.org>
//  Your reuse is governed by the Creative Commons Attribution 3.0 License
//

let service = {
    controller: {},
    model: {
        request: {}
    },
    view: {
        components: {}
    }
};

module.exports = service;

let Service = require("./view/components/Service");
service.ApplicationFacade = require("./ApplicationFacade");
service.ApplicationFacade.getInstance("service").startup(new Service());