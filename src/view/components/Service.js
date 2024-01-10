//
//  Service.js
//  PureMVC JS Demo - EmployeeAdmin Microservice
//
//  Copyright(c) 2023 Saad Shams <saad.shams@puremvc.org>
//  Your reuse is governed by the Creative Commons Attribution 3.0 License
//

import https from "node:https";
import querystring from "node:querystring";

export class Service {

    constructor(options) {
        this.options = options;
    }

    startup() {
        https.createServer(this.options, this.service.bind(this)).listen(443, () => {
            console.log(`Server running on https://127.0.0.1:443`);
        });
    }

    service(request, response) {
        if (request.method === "OPTIONS") {
            response.setHeader("Access-Control-Allow-Origin", "*");
            response.setHeader("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
            response.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET, POST, PUT, DELETE");
            response.writeHead(200).end();
        } else if(request.method === "GET" || request.method === "DELETE") {
            this.delegate.service(request, response);
        } else if(request.method === "POST" || request.method === "PUT") { // parse body
            let buffers = [];
            request
                .on("data", buffers.push.bind(buffers))
                .on("end", () => {
                    let requestData = "";
                    try {
                        requestData = this.parse(request, buffers);
                    }  catch (error) {
                        this.fault(request, response, {code: 400, result: error.message});
                        return;
                    }
                    this.delegate.service(request, response, requestData);
                })
                .on("error", (error) => {
                    this.fault(request, response, {code: 500, result: error.message});
                });
        } else {
            this.fault(request, response, {code: 405, result: "Method Not Allowed"});
        }
    }

    parse(request, buffers) {
        switch (request.headers["content-type"]) {
            case "application/json":
            case "application/json; charset=utf-8":
                return JSON.parse(Buffer.concat(buffers).toString());
            case "application/x-www-form-urlencoded":
                return querystring.parse(Buffer.concat(buffers).toString());
            case "text/plain":
            case "application/javascript":
            case "application/xml":
            case "text/xml":
            case "text/html":
                return Buffer.concat(buffers).toString();
            default:
                // check: "multipart/form-data; boundary=--------------------------562751304340127950310545"
                return Buffer.concat(buffers).toString();
        }
    }

    result(request, response, resultData) { // resultData { code, result }
        response.writeHead(resultData.code, {"Content-Type": "application/json"});
        response.end(resultData.result !== null ? JSON.stringify(resultData.result) : "");
    }

    fault(request, response, resultData) { // resultData { code, result }
        response.writeHead(resultData.code || 500, {"Content-Type": "application/json"});
        response.end(JSON.stringify({code: resultData.code || 500, message: resultData.result}));
    }

    setDelegate(delegate) {
        this.delegate = delegate;
    }

}
