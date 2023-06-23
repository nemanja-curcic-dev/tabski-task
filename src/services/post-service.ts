import { Service } from 'typedi';
import { PostCreateInput, PostUpdateInput } from '../inputs/post-input';
import { PaginatedPostResponse } from '../dtos/common';
import Post from '../entities/post-entity';
import { IPostRepository } from '../repositories/post-repository';
import { IUserRepository } from '../repositories/user-repository';
import { Transactional, Propagation } from 'typeorm-transactional';
import { BaseService } from './base-service';
import { logger } from '../misc/logger';

export abstract class IPostService {
    abstract createPost(postCreate: PostCreateInput): Promise<Post>;

    abstract updatePost(postUpdate: PostUpdateInput): Promise<Post>;

    abstract deletePost(postId: number): Promise<string>;

    abstract list(page: number, pageSize: number): Promise<PaginatedPostResponse>;

    abstract likePost(userId: number, postId: number): Promise<Post>;
}

@Service()
export class PostService extends BaseService implements IPostService {
    constructor(private postRepository: IPostRepository, private userRepository: IUserRepository) {
        super();
    }

    @Transactional({ propagation: Propagation.REQUIRED })
    public async createPost(postCreate: PostCreateInput): Promise<Post> {
        // check if the author exists
        const author = await this.userRepository.getUserById(postCreate.authorId);

        if (!author) {
            throw this.logAndGetError(`User with id ${postCreate.authorId} does not exists!`);
        }

        const post = new Post();

        post.author = author;
        post.title = postCreate.title;
        post.content = postCreate.content;

        return await this.postRepository.savePost(post);
    }

    @Transactional({ propagation: Propagation.REQUIRED })
    public async updatePost(updatePost: PostUpdateInput): Promise<Post> {
        const post = await this.postRepository.getPostById(updatePost.id);

        if (!post) {
            throw this.logAndGetError(`Post ${updatePost.id} does not exist!`);
        }

        post.title = updatePost.title;
        post.content = updatePost.content;

        return await this.postRepository.savePost(post);
    }

    @Transactional({ propagation: Propagation.REQUIRED })
    public async deletePost(postId: number): Promise<string> {
        const post = await this.postRepository.getPostById(postId);

        if (!post) {
            throw this.logAndGetError(`Post ${postId} does not exist!`);
        }

        await this.postRepository.deletePost(post);
        return `Post ${postId} successfully deleted.`;
    }

    @Transactional({ propagation: Propagation.SUPPORTS })
    public async list(page: number, pageSize: number): Promise<PaginatedPostResponse> {
        const postsCount = await this.postRepository.listPosts(page, pageSize);

        return {
            items: postsCount[0],
            total: postsCount[1],
            page: page,
            pageSize: pageSize,
        };
    }

    @Transactional({ propagation: Propagation.REQUIRED })
    public async likePost(userId: number, postId: number): Promise<Post> {
        const user = await this.userRepository.getUserById(userId, ['likes']);
        const post = await this.postRepository.getPostById(postId, ['likes']);

        if (!user) {
            throw this.logAndGetError(`User ${userId} does not exist!`);
        }

        if (!post) {
            throw this.logAndGetError(`Post ${postId} does not exist!`);
        }

        const userLikedPost = user.likes.find((likedPost) => likedPost.id === post.id);

        if (userLikedPost) {
            logger.debug(`User ${user.name} already liked the post. Removing like.`);
            user.likes = user.likes.filter((likedPost) => likedPost.id !== post.id);
            post.likes = post.likes.filter((likedUser) => likedUser.id !== user.id);
            post.numberOfLikes--;
        } else {
            logger.debug(`Post ${post.title} not liked by user ${user.name}. Adding like.`);
            user.likes = [...user.likes, post];
            post.likes = [...post.likes, user];
            post.numberOfLikes++;
        }

        await this.userRepository.saveUser(user);
        return await this.postRepository.savePost(post);
    }
}

