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

    constructor(mySQL, userData, roleData) {
        super(ServiceProxy.NAME, null);
        this.mySQL = mySQL;
        this.userData = userData;
        this.roleData = roleData;
    }

    async findAllUsers() {
        const connection = await this.mySQL.getConnection();
        try {
            return await this.userData.findAllUsers(connection);
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    }

    async findUserById(id) {
        const connection = await this.mySQL.getConnection();
        try {
            return await this.userData.findUserById(connection, id);
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
            const result = await this.userData.add(connection, user);
            if (user.roles && user.roles.length > 0)
                await this.roleData.updateRolesById(connection, result.body.id, user.roles);
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
            const result = await this.userData.update(connection, user);
            if (user.roles) {
                await this.roleData.deleteRolesById(connection, user.id);
                if (user.roles.length > 0)
                    await this.roleData.updateRolesById(connection, user.id, user.roles)
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
            return await this.userData.deleteById(connection, id);
        } catch(error) {
            throw error;
        } finally {
            connection.release();
        }
    }

    async findAllDepartments() {
        const connection = await this.mySQL.getConnection();
        try {
            return await this.userData.findAllDepartments(connection);
        } catch(error) {
            throw error;
        } finally {
            connection.release();
        }
    }

    async findAllRoles() {
        const connection = await this.mySQL.getConnection();
        try {
            return await this.roleData.findAllRoles(connection);
        } catch(error) {
            throw error;
        } finally {
            connection.release();
        }
    }

    async findRolesById(id) {
        const connection = await this.mySQL.getConnection();
        try {
            return await this.roleData.findRolesById(connection, id);
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
            await this.roleData.deleteRolesById(connection, id);
            const payload = await this.roleData.updateRolesById(connection, id, roles);
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
