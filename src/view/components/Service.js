//
//  Service.js
//  PureMVC JS Demo - EmployeeAdmin Microservice
//
//  Copyright(c) 2023 Saad Shams <saad.shams@puremvc.org>
//  Your reuse is governed by the Creative Commons Attribution 3.0 License
//

import http from "node:http";
import https from "node:https";
import querystring from "node:querystring";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

export class Service {

    constructor(options) {
        this.options = options;
    }

    startup(emitter) {
        http.createServer(
            (request, response) => this.service(request, response, emitter))
            .listen(80, () => { emitter.emit("http"); console.log("HTTP Server running on http://127.0.0.1:80"); });

        https.createServer(this.options,
            (request, response) => this.service(request, response, emitter))
            .listen(443, () => { emitter.emit("https"); console.log("HTTPS Server running on https://127.0.0.1:443"); });
    }

    service(request, response, emitter) {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
        response.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET, POST, PUT, DELETE");

        if (request.method === "OPTIONS") {
            response.writeHead(204).end();
        } else if(request.method === "GET" || request.method === "DELETE") {
            emitter.emit("service", { request, response });
        } else if(request.method === "POST" || request.method === "PUT") { // parse body
            const contentType = request.headers["content-type"] ? request.headers["content-type"].toLowerCase() : "";

            if(contentType.startsWith("multipart/form-data")) {
                let buffer = "", writer, requestData = [];
                const boundary = `--${contentType.split("boundary=")[1]}`;

                request
                    .on("data", /**@param {Buffer} chunk*/ chunk => {
                        buffer += chunk.toString("binary"); // 'utf8', 'binary', 'ascii', 'base64', 'hex'

                        let start = -1, end = -1, formData = null;
                        while((start = buffer.indexOf(`${boundary}\r\n`)) !== -1) {
                            if (start !== -1) {
                                start = `${boundary}\r\n`.length; // start headers
                                end = buffer.indexOf("\r\n\r\n"); // end headers
                                const headers = buffer.slice(start, end); // extract headers
                                buffer = buffer.slice(end + "\r\n\r\n".length); // remove headers

                                const [contentDisposition, mimeType] = headers.split("\r\n"); // header keys and values
                                const [name, filename] = contentDisposition.split("; ").slice(1); // extract values

                                if (filename) {
                                    formData = {name: name.split("=")[1].slice(1, -1), value: null,
                                        filename: filename.split("=")[1].slice(1, -1), mimeType: mimeType.split(": ")[1]};
                                    writer = fs.createWriteStream(path.join(os.tmpdir(), formData.filename));
                                } else {
                                    formData = {name: name, value: null}
                                }
                                requestData.push(formData);
                            }

                            if ((end = buffer.indexOf(`\r\n${boundary}\r\n`)) !== -1) { // intermediate boundary
                                const body = buffer.slice(0, end); // extract body
                                if (formData.filename) writer.end(formData.mimeType === "text/plain" ? body : Buffer.from(body, "binary"));
                                else formData.value = body;
                                buffer = buffer.slice(end + "\r\n".length); // remove body
                            } else if((end = buffer.indexOf(`\r\n${boundary}--\r\n`)) !== -1) { // end boundary
                                const body = buffer.slice(0, end); // extract body
                                if (formData.filename) writer.end(formData.mimeType === "text/plain" ? body : Buffer.from(body, "binary"));
                                else formData.value = body;
                                buffer = buffer.slice(end + `\r\n${boundary}--\r\n`.length); // end of multipart
                            } else { // chunking or segmentation, search stream or chunks for partial boundaries, if found accumulate buffer else serialize

                            }
                        }
                    })
                    .on("end", () => {
                        console.log(requestData);
                        response.end();
                        // emitter.emit("service", {request, response, requestData});
                    })
            } else { // others: application/json, text/plain, application/javascript, application/xml, text/xml, text/html, urlencoded
                let buffers = [];
                request
                    .on("data", /**@param {Buffer} chunk*/ chunk => buffers.push(chunk))
                    .on("end", () => {
                        try { // application/json, application/json; charset=utf-8
                            const body = Buffer.concat(buffers).toString();
                            let requestData = contentType.includes("application/json") ? JSON.parse(body) :
                                contentType === "application/x-www-form-urlencoded" ? querystring.parse(body) : body;
                            emitter.emit("service", { request, response, requestData });
                        } catch (error) { // bad requests
                            this.fault(request, response, { status: 400, body: error.message });
                        }
                    });
            }

            request.on("error", error => this.fault(request, response, {status: 500, body: error.message}));
        } else {
            this.fault(request, response, {status: 405, body: "Method Not Allowed"});
        }
    }

    result(request, response, {status, body}) {
        response.writeHead(status, {"Content-Type": "application/json"});
        response.end(body !== null ? JSON.stringify(body) : "");
    }

    fault(request, response, {status, body}) {
        response.writeHead(status, {"Content-Type": "application/json"});
        response.end(JSON.stringify({code: status, message: body}));
    }

}
