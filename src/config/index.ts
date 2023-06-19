import { DataSource } from 'typeorm';
import { Envs } from './envs';
import { logger } from '../misc/logger';
import { addTransactionalDataSource, initializeTransactionalContext } from 'typeorm-transactional';
import path from 'path';
import { Container } from 'typedi';
import { IUserRepository, UserRepository } from '../repositories/user-repository';
import { IUserService, UserService } from '../services/user-service';
import { IPostRepository, PostRepository } from '../repositories/post-repository';
import { IPostService, PostService } from '../services/post-service';

// Database configuration
export let db: DataSource;

if (!Envs.TESTING) {
    db = new DataSource({
        type: 'postgres',
        url: Envs.DATABASE_URL,
        migrationsRun: true,
        entities: [path.join(__dirname, '..', 'entities', '*.*')],
        migrations: [path.join(__dirname, '..', 'migrations', '*.*')],
    });
} else {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const pg = require('pg-mem');
    const pgMem = pg.newDb();

    db = pgMem.adapters.createTypeormDataSource({
        type: 'postgres',
        url: Envs.DATABASE_URL,
        synchronize: true,
        entities: [path.join(__dirname, '..', 'entities', '*.*')],
    });
}

// add transactional context
initializeTransactionalContext();
addTransactionalDataSource(db);

export class DBConnection {
    public async connect(): Promise<void> {
        while (!db.isInitialized) {
            logger.info('Connecting to DB...');
            try {
                await db.initialize();
            } catch (dbErr) {
                logger.warn(`Cannot connect to DB. Error: ${dbErr.message}`);
                logger.info('Retrying connection to DB in 5 seconds...');
                await new Promise((resolve) => setTimeout(resolve, 5000));
            }
        }
        logger.info('Connected to DB!');
    }

    public async shutdown(): Promise<void> {
        if (db.isInitialized) {
            logger.info('Closing connection with the database... ');
            await db.destroy();
        }
    }
}

// Dependency injection configuration
(function configureDependencies(): void {
    Container.set(DataSource, db);

    Container.set(IUserRepository, Container.get(UserRepository));
    Container.set(IPostRepository, Container.get(PostRepository));

    Container.set(IUserService, Container.get(UserService));
    Container.set(IPostService, Container.get(PostService));
})();
