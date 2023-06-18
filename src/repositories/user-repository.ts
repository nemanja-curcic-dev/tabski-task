import { Repository, DataSource } from 'typeorm';
import User from '../entities/user-entity';
import { Service, Container } from 'typedi';

export abstract class IUserRepository {
    abstract listUsers(page: number, pageSize: number): Promise<[User[], number]>;

    abstract getUserByEmail(email: string): Promise<User | null>;

    abstract getUserById(id: number): Promise<User | null>;

    abstract saveUser(user: User): Promise<User>;

    abstract deleteUser(user: User): Promise<void>;
}

@Service()
export class UserRepository implements IUserRepository {
    private repository: Repository<User>;

    constructor() {
        this.repository = Container.get(DataSource).getRepository(User);
    }

    public async getUserById(id: number): Promise<User | null> {
        return await this.repository.findOne({
            where: {
                id: id
            }
        });
    }

    public async listUsers(page: number, pageSize: number): Promise<[User[], number]> {
        return await this.repository.findAndCount({
            skip: (page - 1) * pageSize,
            take: pageSize
        });
    }

    public async getUserByEmail(email: string): Promise<User | null> {
        return await this.repository.findOne({
            where: {
                email: email
            }
        });
    }

    public async saveUser(user: User): Promise<User> {
        return await this.repository.save(user);
    }

    public async deleteUser(user: User): Promise<void> {
        await this.repository.remove(user);
    }
}