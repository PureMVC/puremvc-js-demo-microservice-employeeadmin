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
        findRolesByUserId(id: ID!): [Role!]!
    }
    type Mutation {
        save(username: String!, first: String!, last: String!, email: String!, password: String!, department: IDepartment!, roles: [IRole!]): User
        update(id: ID!, username: String!, first: String!, last: String!, email: String!, password: String!, department: IDepartment!, roles: [IRole!]): User
        updateRolesByUserId(id: ID!, roles: [IRole!]!): Boolean
        deleteById(id: ID!): Boolean
    }
`

/**
 Field-level authorization directives.
 type User {
   id: ID!
   username: String!
   salary: Float @auth(role: ADMIN)
   ssn: String @auth(role: ADMIN)
   email: String @auth(role: MANAGER)
 }

 type User {
   id: ID!
   username: String!
   email: String! @hasRole(role: "ADMIN")
 }

 type User {
   id: ID!
   username: String!
   email: String! @requiresRole(role: "ADMIN")
 }

 const resolvers = {
   User: {
     email(user, args, context) {
       if (!context.user.roles.includes("ADMIN")) {
         throw new Error("Unauthorized");
       }
       return user.email;
     }
  }
 };

 function authDirective(resolver, role) {
   return async (parent, args, context, info) => {
     if (!context.user.roles.includes(role)) {
       throw new Error("Forbidden");
     }

     return resolver(parent, args, context, info);
  };
 }

 Usage
 schema.User.email.resolve = authDirective(schema.User.email.resolve, "ADMIN");
 */

