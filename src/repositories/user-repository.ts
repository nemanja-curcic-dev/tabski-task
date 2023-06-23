import { Repository, DataSource, In } from 'typeorm';
import User from '../entities/user-entity';
import { Service, Container } from 'typedi';
import { LogMethodCalled, logger } from '../misc/logger';

export abstract class IUserRepository {
    abstract listUsers(page: number, pageSize: number): Promise<[User[], number]>;

    abstract getUserByEmail(email: string): Promise<User | null>;

    abstract getUserById(id: number, relations? : string[]): Promise<User | null>;

    abstract saveUser(user: User): Promise<User>;

    abstract deleteUser(user: User): Promise<void>;

    abstract listUsersByPostIds(ids: number[]): Promise<User[]>;
}

@Service()
export class UserRepository implements IUserRepository {
    private repository: Repository<User>;

    constructor() {
        this.repository = Container.get(DataSource).getRepository(User);
    }

    @LogMethodCalled
    public async getUserById(id: number, relations?: string[]): Promise<User | null> {
        logger.debug(`Getting user by id ${id}...`);
        return await this.repository.findOne({
            where: {
                id: id,
            },
            relations: relations ? relations : []
        });
    }

    @LogMethodCalled
    public async listUsers(page: number, pageSize: number): Promise<[User[], number]> {
        logger.debug(`Listing users - page: ${page}, pageSize: ${pageSize}...`);
        return await this.repository.findAndCount({
            skip: (page - 1) * pageSize,
            take: pageSize,
        });
    }

    @LogMethodCalled
    public async getUserByEmail(email: string): Promise<User | null> {
        logger.debug(`Getting user by email: ${email}...`);
        return await this.repository.findOne({
            where: {
                email: email,
            },
        });
    }

    @LogMethodCalled
    public async saveUser(user: User): Promise<User> {
        logger.debug(`Saving user with email: ${user.email}...`);
        return await this.repository.save(user);
    }

    @LogMethodCalled
    public async deleteUser(user: User): Promise<void> {
        logger.debug(`Deleting user ${user.email}...`);
        await this.repository.remove(user);
    }

    @LogMethodCalled
    public async  listUsersByPostIds(ids: number[]): Promise<User[]> {
        logger.debug(`Listing users by post ids: ${JSON.stringify(ids)}`);
        const result = await this.repository.find({
            where: {
                posts: {
                    id: In (ids)
                }
            },
            relations: ['posts']
        });

        return result;
    }
}
