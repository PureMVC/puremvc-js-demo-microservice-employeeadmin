//
//  UserService.js
//  PureMVC JS Demo - EmployeeAdmin Microservice
//
//  Copyright(c) 2023 Saad Shams <saad.shams@puremvc.org>
//  Your reuse is governed by the Creative Commons Attribution 3.0 License
//

import https from "node:https";

export class UserService {

    constructor() {}

    // Simple Use Case:
    // If the data is sourced externally, the Proxy first checks the database (UserData) to see if the data is
    // available. If available, it returns the cached data to the Mediator. Otherwise, it contacts the UserService.
    // Service classes retrieve data from external sources, manage network requests and parsing, and return data to
    // the Proxy, which then caches it in the database for future use before returning it to the Mediator.

    // Complex Use Case:
    // A Command will come into play if the data retrieval involves multiple proxies and data sources,
    // typically if the logic spans different domains.
    // The Command encapsulates business logic, manages data retrieval, performs data transformation, and
    // enforces business rules before returning the final data to the Mediator and its component.
    findAllUsers() {
        return new Promise((resolve, reject) => {
            https.request({
                method: "GET", hostname: "https://jsonplaceholder.typicode.com", path: "/users"
            }, response => {
                let buffers = [];
                response.on("data", data => buffers.push(data));
                response.on("end", () => {
                    try {
                        if(response.statusCode === 200)
                            resolve(JSON.parse(Buffer.concat(buffers).toString()));
                        else
                            reject(JSON.parse(Buffer.concat(buffers).toString()));
                    } catch(error) { reject(error); }
                });
            }).on("error", reject).end();
        });
    }

}
