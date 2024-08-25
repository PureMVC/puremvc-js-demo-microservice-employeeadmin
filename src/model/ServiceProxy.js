//
//  ServiceProxy.js
//  PureMVC JS Demo - EmployeeAdmin Microservice
//
//  Copyright(c) 2023 Saad Shams <saad.shams@puremvc.org>
//  Your reuse is governed by the Creative Commons Attribution 3.0 License
//

import {Proxy} from "@puremvc/puremvc-js-multicore-framework";

export class ServiceProxy extends Proxy {

    static get NAME() { return "ServiceProxy" };

    constructor(mySQL, user, role) {
        super(ServiceProxy.NAME, null);
        this.mySQL = mySQL;
        this.user = user;
        this.role = role;
    }

    async findAllUsers() {
        const connection = await this.mySQL.getConnection();
        try {
            return await this.user.findAllUsers(connection);
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    }

    async findUserById(id) {
        const connection = await this.mySQL.getConnection();
        try {
            return await this.user.findUserById(connection, id);
        } catch(error) {
            throw error;
        } finally {
            connection.release();
        }
    }

    async add(user) {
        const connection = await this.mySQL.getConnection();
        try {
            await this.mySQL.beginTransaction(connection);
            const result = await this.user.add(connection, user);
            if (user.roles)
                await this.role.updateRolesById(connection, result.body.id, user.roles);
            await this.mySQL.commit(connection);
            return result;
        } catch(error) {
            await this.mySQL.rollback(connection);
            throw error;
        } finally {
            connection.release();
        }
    }

    async update(user) {
        const connection = await this.mySQL.getConnection();
        try {
            await this.mySQL.beginTransaction(connection);
            const result = await this.user.update(connection, user);
            if (user.roles) {
                await this.role.deleteRolesById(connection, user.id);
                await this.role.updateRolesById(connection, user.id, user.roles)
            }
            await this.mySQL.commit(connection);
            result.body = user;
            return result;
        } catch(error) {
            await this.mySQL.rollback(connection);
            throw error;
        } finally {
            connection.release();
        }
    }

    async deleteById(id) {
        const connection = await this.mySQL.getConnection();
        try {
            return await this.user.deleteById(connection, id);
        } catch(error) {
            throw error;
        } finally {
            connection.release();
        }
    }

    async findAllDepartments() {
        const connection = await this.mySQL.getConnection();
        try {
            return await this.user.findAllDepartments(connection);
        } catch(error) {
            throw error;
        } finally {
            connection.release();
        }
    }

    async findAllRoles() {
        const connection = await this.mySQL.getConnection();
        try {
            return await this.role.findAllRoles(connection);
        } catch(error) {
            throw error;
        } finally {
            connection.release();
        }
    }

    async findRolesById(id) {
        const connection = await this.mySQL.getConnection();
        try {
            return await this.role.findRolesById(connection, id);
        } catch(error) {
            throw error;
        } finally {
            connection.release();
        }
    }

    async updateRolesById(id, roles) {
        const connection = await this.mySQL.getConnection();
        try {
            await this.mySQL.beginTransaction(connection);
            await this.role.deleteRolesById(connection, id);
            const payload = await this.role.updateRolesById(connection, id, roles);
            await this.mySQL.commit(connection);
            return payload;
        } catch (error) {
            await this.mySQL.rollback(connection);
            throw error;
        } finally {
            connection.release();
        }
    }

}
