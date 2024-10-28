/**
 *
 * @param {ServiceProxy} serviceProxy
 */
export const resolvers = (serviceProxy) => ({
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
        findRolesById: async (_, args) => {
            return (await serviceProxy.findRolesById(Number(args.id))).body;
        }
    },
    Mutation: {
        save: async(_, args) => {
            return (await serviceProxy.save({...args, department: {id: Number(args.department.id)}})).body;
        },
        update: async(_, args) => {
            return (await serviceProxy.update({...args, department: {id: Number(args.department.id)}})).body;
        },
        deleteById: async (_, args) => {
            return (await serviceProxy.deleteById(Number(args.id))).body === null;
        },
        updateRolesById: async (_, args) => {
            return (await serviceProxy.updateRolesById(Number(args.id), args.roles)).body === null;
        }
    },
    User: {
        department: async (parent) => {
            const departments = (await serviceProxy.findAllDepartments()).body;
            return departments.find(department => department.id === parent.department.id);
        },
        roles: async (parent) => {
            return (await serviceProxy.findRolesById(Number(parent.id))).body
        }
    },
});
