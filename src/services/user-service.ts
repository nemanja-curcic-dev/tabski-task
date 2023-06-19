import User from '../entities/user-entity';
import { Service } from 'typedi';
import { UserCreateInput, UserUpdateInput } from '../inputs/user-input';
import { IUserRepository } from '../repositories/user-repository';
import { Transactional, Propagation } from 'typeorm-transactional';
import { PaginatedUserResponse } from '../dtos/common';
import bcrypt from 'bcrypt';
import { BaseService } from './base-service';

export abstract class IUserService {
    abstract createUser(userCreate: UserCreateInput): Promise<User>;

    abstract updateUser(userUpdate: UserUpdateInput): Promise<User>;

    abstract deleteUser(userId: number): Promise<string>;

    abstract list(page: number, pageSize: number): Promise<PaginatedUserResponse>;
}

@Service()
export class UserService extends BaseService implements IUserService {
    constructor(private userRepository: IUserRepository) {
        super();
    }

    @Transactional({ propagation: Propagation.REQUIRED })
    public async createUser(userCreate: UserCreateInput): Promise<User> {
        // check if user with the same email exists
        const userWithSameEmail = await this.userRepository.getUserByEmail(userCreate.email);

        if (userWithSameEmail) {
            throw this.logAndGetError(`User with email ${userCreate.email} already exists!`);
        }

        // check if passwords match
        if (userCreate.password !== userCreate.passwordConfirm) {
            throw this.logAndGetError('Passwords do not match!');
        }

        // create password hash
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(userCreate.password, salt);

        // save user
        const user = new User();
        user.name = userCreate.name;
        user.email = userCreate.email;
        user.password = hash;

        return await this.userRepository.saveUser(user);
    }

    @Transactional({ propagation: Propagation.REQUIRED })
    public async updateUser(userUpdate: UserUpdateInput): Promise<User> {
        const user = await this.userRepository.getUserById(userUpdate.id);

        if (!user) {
            throw this.logAndGetError(`User ${userUpdate.id} does not exist!`);
        }

        // check if email is changed and if the same one exists
        if (userUpdate.email !== user.email) {
            const userWithSameEmail = await this.userRepository.getUserByEmail(userUpdate.email);

            if (userWithSameEmail) {
                throw this.logAndGetError(`User with email ${userUpdate.email} already exists!`);
            }
        }

        user.email = userUpdate.email;
        user.name = userUpdate.name;

        return await this.userRepository.saveUser(user);
    }

    @Transactional({ propagation: Propagation.SUPPORTS })
    public async list(page: number, pageSize: number): Promise<PaginatedUserResponse> {
        const usersCount = await this.userRepository.listUsers(page, pageSize);

        return {
            items: usersCount[0],
            total: usersCount[1],
            page: page,
            pageSize: pageSize,
        };
    }

    @Transactional({ propagation: Propagation.REQUIRED })
    public async deleteUser(userId: number): Promise<string> {
        const user = await this.userRepository.getUserById(userId);

        if (!user) {
            throw this.logAndGetError(`User ${userId} does not exist!`);
        }

        await this.userRepository.deleteUser(user);
        return `User ${userId} successfully deleted.`;
    }
}