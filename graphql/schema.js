"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const resolvers_1 = require("./resolvers");
const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLList, GraphQLBoolean, GraphQLInt, } = require("graphql");
const PictureType = new GraphQLObjectType({
    name: "picture",
    description: "this represents picture of a vessel",
    fields: () => ({
        data: { type: GraphQLString },
    }),
});
const VesselType = new GraphQLObjectType({
    name: "VesselType",
    description: "this represents book written by an author",
    fields: () => ({
        _id: { type: GraphQLString },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        user: { type: GraphQLString },
        location: { type: GraphQLString },
        year: { type: GraphQLInt },
        size: { type: GraphQLString },
        type: { type: GraphQLString },
        pictures: { type: new GraphQLList(PictureType) },
        pricePerDay: { type: GraphQLInt },
        pricePerWeek: { type: GraphQLInt },
        pickupDay: { type: GraphQLString },
        returnDay: { type: GraphQLString },
        amount: { type: GraphQLInt },
    }),
});
module.exports = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: "Query",
        description: "Root Query",
        fields: () => ({
            vessels: {
                type: new GraphQLList(VesselType),
                description: "Searched Vessel",
                args: {
                    city: { type: GraphQLString },
                    type: { type: GraphQLString },
                    location: { type: GraphQLString },
                    size: { type: GraphQLString },
                    pickupDay: { type: GraphQLString },
                    returnDay: { type: GraphQLString },
                    sort: { type: GraphQLString },
                    page: { type: GraphQLInt },
                },
                resolve: resolvers_1.findVesselsResolver,
            },
        }),
    }),
});
