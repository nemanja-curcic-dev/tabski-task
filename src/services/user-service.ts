import User from '../entities/user-entity';
import { GraphQLError } from 'graphql';
import { ApolloServerErrorCode } from '@apollo/server/errors';
import { Service } from 'typedi';
import { UserCreateInput } from '../inputs/user-input';
import { IUserRepository } from '../repositories/user-repository';
import { Transactional, Propagation } from 'typeorm-transactional';
import { PaginatedUserResponse } from '../dtos/common';
import bcrypt from 'bcrypt';

export abstract class IUserService {
    abstract createUser(userCreate: UserCreateInput): Promise<User>;

    abstract list(page: number, pageSize: number): Promise<PaginatedUserResponse>;
}

@Service()
export class UserService implements IUserService {
    constructor(private userRepository: IUserRepository) {}

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
    public async createUser(userCreate: UserCreateInput): Promise<User> {
        // check if user with the same email exists
        const userWithSameEmail = await this.userRepository.getUserByEmail(userCreate.email);

        if (userWithSameEmail) {
            throw new GraphQLError(`User with email ${userCreate.email} already exists!`, {
                extensions: {
                    code: ApolloServerErrorCode.BAD_REQUEST,
                },
            });
        }

        // check if passwords match
        if (userCreate.password !== userCreate.passwordConfirm) {
            throw new GraphQLError('Passwords do not match!', {
                extensions: {
                    code: ApolloServerErrorCode.BAD_USER_INPUT,
                },
            });
        }

        // create hash of password
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(userCreate.password, salt);

        // save user
        const user = new User();

        user.name = userCreate.name;
        user.email = userCreate.email;
        user.password = hash;

        return await this.userRepository.saveUser(user);
    }
}