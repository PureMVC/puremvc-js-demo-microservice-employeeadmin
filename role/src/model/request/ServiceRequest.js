//
//  ServiceRequest.js
//  PureMVC JS Demo - EmployeeAdmin Microservice
//
//  Copyright(c) 2019 Saad Shams <saad.shams@puremvc.org>
//  Your reuse is governed by the Creative Commons Attribution 3.0 License
//

function ServiceRequest(request, response, requestData) {
    this.request = request;
    this.response = response;
    this.requestData = requestData;
}

ServiceRequest.prototype.request;

ServiceRequest.prototype.response;

ServiceRequest.prototype.requestData;

ServiceRequest.prototype.resultData;

ServiceRequest.prototype.status;

ServiceRequest.prototype.setResultData = function(status, resultData) {
    this.status = status;
    this.resultData = resultData;
};

module.exports = ServiceRequest;