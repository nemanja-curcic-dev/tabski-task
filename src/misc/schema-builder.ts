import { buildSchema } from 'type-graphql';
import { GraphQLSchema } from 'graphql';
import UserResolver from '../resolvers/user-resolver';
import Container from 'typedi';

export const createSchema = async (): Promise<GraphQLSchema> => {
    return await buildSchema({
        resolvers: [
            UserResolver
        ],
        validate: {
            forbidUnknownValues: false,
        },
        container: Container
    });
};