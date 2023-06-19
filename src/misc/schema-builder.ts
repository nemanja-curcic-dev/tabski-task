import { buildSchema } from 'type-graphql';
import { GraphQLSchema } from 'graphql';
import UserResolver from '../resolvers/user-resolver';
import PostResolver from '../resolvers/post-resolver';
import Container from 'typedi';

export const createSchema = async (): Promise<GraphQLSchema> => {
    return await buildSchema({
        resolvers: [
            UserResolver,
            PostResolver
        ],
        validate: {
            forbidUnknownValues: false,
        },
        container: Container
    });
};