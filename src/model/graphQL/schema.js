export const schema = `#graphql 
    type User {
        id: ID!,
        username: String!,
        first: String!,
        last: String!,
        email: String!,
        password: String!,
        department: Department!,
        roles: [Role!]
    }
    type Department {
        id: ID!,
        name: String!
    }
    input IDepartment {
        id: ID!,
        name: String!
    }
    type Role {
        id: ID!,
        name: String!
    }
    input IRole {
        id: ID!,
        name: String!
    }
    type Query {
        findAll: [User!]!,
        findById(id: ID!): User,
        findAllDepartments: [Department!]!,
        findAllRoles: [Role!]!
    }
    type Mutation {
        save(username: String!, first: String!, last: String!, email: String!, password: String!, department: IDepartment!, roles: [IRole!]): User
        update(id: ID!, username: String!, first: String!, last: String!, email: String!, password: String!, department: IDepartment!, roles: [IRole!]): User
        deleteById(id: ID!): Boolean
    }
`
