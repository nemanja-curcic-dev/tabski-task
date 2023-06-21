import 'reflect-metadata';
import { logger } from './misc/logger';
import { FormatError } from './misc/error-formatting';
import { DBConnection } from './config';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { createSchema } from './misc/schema-builder';
import { json } from 'body-parser';
import express from 'express';
import http from 'http';
import cors from 'cors';
import { createContext } from './services/post-service';

let dbConnection: DBConnection;

const shutdown = async (): Promise<void> => {
    logger.info('SIGTERM/SIGINT received... ');

    // close connection with the database
    if (dbConnection) {
        await dbConnection.shutdown();
    }

    // exit process
    process.exit(0);
};

const main = async (): Promise<void> => {
    try {
        dbConnection = new DBConnection();
        await dbConnection.connect();

        const app = express();
        const httpServer = http.createServer(app);
        const server = new ApolloServer({
            schema: await createSchema(),
            csrfPrevention: true,
            formatError: FormatError,
        });
        await server.start();

        app.use('/graphql', cors<cors.CorsRequest>(), json(), expressMiddleware(server, {
            context: async ({ req }) => {
                return createContext();
            }
        }));

        await new Promise<void>((resolve) => httpServer.listen({ port: 4000 }, resolve));
        logger.debug('App listening on port 4000');
    } catch (e) {
        logger.error(e.message);
        process.exit(1);
    }
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

main();
