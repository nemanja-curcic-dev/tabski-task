import { Resolver, Query, Mutation, Arg, Int, ID } from 'type-graphql';
import Post from '../entities/post-entity';
import { IPostService } from '../services/post-service';
import { Service } from 'typedi';
import { PostCreateInput, PostUpdateInput } from '../inputs/post-input';
import { LogMethodCalled } from '../misc/logger';
import { PaginatedPostResponse } from '../dtos/common';

@Resolver()
@Service()
export default class PostResolver {
    constructor(private postService: IPostService) {}

    @Mutation(() => Post)
    @LogMethodCalled
    async postCreate(@Arg('postCreate') postCreate: PostCreateInput): Promise<Post> {
        return await this.postService.createPost(postCreate);
    }

    @Mutation(() => Post)
    @LogMethodCalled
    async postUpdate(@Arg('postUpdate') postUpdate: PostUpdateInput): Promise<Post> {
        return await this.postService.updatePost(postUpdate);
    }

    @Mutation(() => String)
    @LogMethodCalled
    async postDelete(@Arg('postId', () => ID) postId: number): Promise<string> {
        return await this.postService.deletePost(postId);
    }

    @Query(() => PaginatedPostResponse)
    @LogMethodCalled
    async posts(
        @Arg('page', () => Int, { nullable: true }) page?: number,
        @Arg('pageSize', () => Int, { nullable: true }) pageSize?: number
    ): Promise<PaginatedPostResponse> {
        return await this.postService.list(page || 1, pageSize || 10);
    }
}
