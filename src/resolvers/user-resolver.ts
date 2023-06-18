import { Resolver, Query, Mutation, Arg, Int, ID } from 'type-graphql';
import User from '../entities/user-entity';
import { IUserService } from '../services/user-service';
import { Service } from 'typedi';
import { UserCreateInput, UserUpdateInput } from '../inputs/user-input';
import { LogResolverCalled } from '../misc/logger';
import { PaginatedUserResponse } from '../dtos/common';

@Resolver()
@Service()
export default class UserResolver {
    constructor(private userService: IUserService) {}

    @Mutation(() => User)
    @LogResolverCalled
    async userCreate(@Arg('userCreate') userCreate: UserCreateInput): Promise<User> {
        return await this.userService.createUser(userCreate);
    }

    @Mutation(() => User)
    @LogResolverCalled
    async userUpdate(@Arg('userUpdate') userUpdate: UserUpdateInput): Promise<User> {
        return await this.userService.updateUser(userUpdate);
    }

    @Mutation(() => String)
    @LogResolverCalled
    async userDelete(@Arg('userId', () => ID) userId?: number): Promise<string> {
        return await this.userService.deleteUser(Number(userId));
    }

    @Query(() => PaginatedUserResponse)
    @LogResolverCalled
    async users(
        @Arg('page', () => Int, { nullable: true }) page?: number,
        @Arg('pageSize', () => Int, { nullable: true }) pageSize?: number
    ): Promise<PaginatedUserResponse> {
        return await this.userService.list(page || 1, pageSize || 10);
    }
}
