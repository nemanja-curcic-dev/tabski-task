import { GraphQLError } from 'graphql';
import { ApolloServerErrorCode } from '@apollo/server/errors';
import { logger } from '../misc/logger';

// base class with existing and potential common functionality
export class BaseService {
    protected logAndGetError(msg: string, code?: ApolloServerErrorCode): GraphQLError {
        logger.error(msg);
        return new GraphQLError(msg, {
            extensions: {
                code: code || ApolloServerErrorCode.BAD_REQUEST
            }
        });
    }
}