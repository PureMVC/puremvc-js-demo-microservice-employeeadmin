//
//  Service.js
//  PureMVC JS Demo - EmployeeAdmin Microservice
//
//  Copyright(c) 2019 Saad Shams <saad.shams@puremvc.org>
//  Your reuse is governed by the Creative Commons Attribution 3.0 License
//

function Service() {}

Service.prototype.createServer = function() {
    let self = this;

    require("http").createServer(function(request, response) {

        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
        response.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET, POST, PUT, DELETE");

        if(request.method === "GET" || request.method === "DELETE") {
            self.delegate.service(request, response);
        } else if(request.method === "POST" || request.method === "PUT") {

            let buffers = [];
            request.on("data", buffers.push.bind(buffers));
            request.on("end", function(){
                switch (request.headers["content-type"]) {
                    case "application/json":
                    case "application/json; charset=utf-8":
                        self.delegate.service(request, response, JSON.parse(Buffer.concat(buffers).toString()));
                        break;

                    case "application/x-www-form-urlencoded": // urlencoded/binary
                        self.delegate.service(request, response, require('querystring').parse(Buffer.concat(buffers).toString()));
                        break;
                    case "text/plain": // raw
                    case "application/javascript":
                    case "application/xml":
                    case "text/xml":
                    case "text/html":
                        self.delegate.service(request, response, Buffer.concat(buffers).toString());
                        break;

                    default:
                        self.fault(request, response, 400, {code: 400, message: "Missing or unsupported content-type header"});
                }
            });
        } else if(request.method === "OPTIONS") {
            self.result(request, response, 200);
        } else {
            self.fault(request, response, 405, {code:405, message: "Method Not Allowed"});
        }
    }).listen(process.env.NODE_PORT || 80, function(error){
        console.log(error ? error : "Server running at PORT:" + (process.env.NODE_PORT || 80));
    });
};

Service.prototype.result = function(request, response, status, data) {
    if(data == null) {
        response.writeHead(status || 200);
        response.end();
    } else {
        if(request.method === "POST") {
            response.setHeader("Location", require('url').parse(request.url).pathname + "/" + data.id);
        }
        response.writeHead(status || 200, {"Content-Type": "application/json"});
        response.end(JSON.stringify(data));
    }
};

Service.prototype.fault = function(request, response, status, error) {
    if(error == null) {
        response.writeHead(status, {"Content-Type": "application/json", "HOST": process.env.CONSUL_ID || require("os").hostname()});
        response.end(JSON.stringify({code: status || 500, message: "Internal Server Error"}));
    } else {
        response.writeHead(status, {"Content-Type": "application/json", "HOST": process.env.CONSUL_ID || require("os").hostname()});
        response.end(JSON.stringify({code: error.code, message: error.message, stack: error.stack}));
    }
};

Service.prototype.log = function(request, response, status, data, body) {
    let ip = request.connection.remoteAddress.includes("::") ? "[" + request.connection.remoteAddress + "]" : request.connection.remoteAddress;
    if(status >= 400) { // error
        console.error(new Date(), ip, status, request.method, request.url, JSON.stringify(body) || "null", JSON.stringify(request.headers));
    } else {
        console.log(new Date(), ip, status, request.method, request.url, JSON.stringify(body) ||  "null", JSON.stringify(request.headers));
    }
};

Service.prototype.setDelegate = function(delegate) {
    this.delegate = delegate;
};

Service.prototype.delegate;

module.exports = Service;
