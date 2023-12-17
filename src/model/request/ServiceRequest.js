//
//  ServiceRequest.js
//  PureMVC JS Demo - EmployeeAdmin Microservice
//
//  Copyright(c) 2023 Saad Shams <saad.shams@puremvc.org>
//  Your reuse is governed by the Creative Commons Attribution 3.0 License
//

export class ServiceRequest {

    constructor(request, response, requestData) {
        this.request = request;
        this.response = response;
        this.requestData = requestData;
        this.resultData = {status: 0, resultData: ""};
        this.logs = [];

        let ip = request.connection.remoteAddress.includes("::") ? "[" + request.connection.remoteAddress + "]" : request.connection.remoteAddress;
        this.logs.push(ip);
    }


}
