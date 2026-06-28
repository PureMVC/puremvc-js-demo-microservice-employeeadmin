//
//  ServiceMediator.js
//  PureMVC JS Demo - EmployeeAdmin Microservice
//
//  Copyright(c) 2023 Saad Shams <saad.shams@puremvc.org>
//  Your reuse is governed by the Creative Commons Attribution 3.0 License
//

import {Mediator} from "@puremvc/puremvc-js-multicore-framework";
import {ServiceProxy} from "../model/ServiceProxy.js";
import {schema} from "./Schema.js";

export class ServiceMediator extends Mediator {

    static NAME = "ServiceMediator";

    constructor(service) {
        super(ServiceMediator.NAME, service);
    }

    async onRegister() {
        const serviceProxy = /** @type {ServiceProxy} */  this.facade.retrieveProxy(ServiceProxy.NAME);
        await this.component.startup(schema, this.resolvers(serviceProxy));
    }

    /** @param {ServiceProxy} serviceProxy */
    resolvers = (serviceProxy) => ({
        Query: {
            findAll: async() => {
                return (await serviceProxy.findAll()).body;
            },
            findById: async (_, args) => {
                return (await serviceProxy.findById(Number(args.id))).body;
            },
            findAllDepartments: async () => {
                return (await serviceProxy.findAllDepartments()).body;
            },
            findAllRoles: async () => {
                return (await serviceProxy.findAllRoles()).body;
            },
            findRolesByUserId: async (_, args) => {
                return (await serviceProxy.findRolesByUserId(Number(args.id))).body;
            }
        },
        Mutation: {
            save: async(_, args) => {
                return (
                    await serviceProxy.save({
                        ...args,
                        department: { id: Number(args.department.id) },
                        roles: args.roles?.map(role => ({ id: Number(role.id) })) ?? null,
                    })
                ).body;
            },
            update: async(_, args) => {
                return (
                    await serviceProxy.update({
                        ...args,
                        department: { id: Number(args.department.id) },
                        roles: args.roles?.map(role => ({ id: Number(role.id) })) ?? null,
                    })
                ).body;
            },
            deleteById: async (_, args) => {
                return (await serviceProxy.deleteById(Number(args.id))).body === null;
            },
            updateRolesByUserId: async (_, args) => {
                return (await serviceProxy.updateRolesByUserId(Number(args.id), args.roles)).body === null;
            }
        },
        User: {
            department: async (parent) => {
                const departments = (await serviceProxy.findAllDepartments()).body;
                return departments.find(department => department.id === parent.department.id);
            },
            roles: async (parent) => {
                return (await serviceProxy.findRolesByUserId(Number(parent.id))).body
            }
        },
    });

    /** @returns {Service} component */
    get component() {
        return this.viewComponent;
    }

}
