//
//  Service.js
//  PureMVC JS Demo - EmployeeAdmin Microservice
//
//  Copyright(c) 2023 Saad Shams <saad.shams@puremvc.org>
//  Your reuse is governed by the Creative Commons Attribution 3.0 License
//

import {ApolloServer} from "@apollo/server";
import {startStandaloneServer} from "@apollo/server/standalone";

export class Service {

    constructor(options) {
        this.options = options;
    }

    async startup(typeDefs, resolvers) {
        const { url } = await startStandaloneServer(new ApolloServer({
            typeDefs,
            resolvers
        }), { listen: {port: 80} });

        console.log("HTTP Server running on", url);
    }

}
