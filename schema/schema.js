const graphql = require('graphql');
var _ = require('lodash');
const User = require('../models/User');

const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
} = graphql


const UserType = new GraphQLObjectType({
    name: 'User',
    description: 'Documentaion for user..',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        password: {type: GraphQLString},
        email: {type: GraphQLString},
        color: {type: GraphQLString}
    })
})



//RootQuery
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    description: 'Description',
    fields:{
        user: {
            type: UserType,
            args: {id: {type: GraphQLID}},
            resolve(parent,args) {
                return User.findById(args.id);
            }
        },
        users: {
            type: new GraphQLList(UserType),
            resolve(parent,args) {
                return User.find({});
            }
        }
    }
});


//Mutations

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        createUser: {
            type: UserType,
            args: {
                // id: {type: GraphQLID},
                name: {type: new GraphQLNonNull(GraphQLString)},
                password: {type: new GraphQLNonNull(GraphQLString)},
                email: {type: GraphQLString}
            },
            resolve(parent,args) {
                let user = new User({
                    name: args.name,
                    password: args.password,
                    email: args.email
                });
                // save to db
                return user.save();
            }
        },
        updateUser: {
            type: UserType,
            args: {
                email: {type: GraphQLString},
                color: {type: GraphQLString}
            },
            resolve(parent,args) {
                return updateduser = User.findOneAndUpdate(
                    {email:args.email},
                    {
                    color: args.color
                    }
                )
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})