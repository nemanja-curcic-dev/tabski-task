import { Service } from 'typedi';
import { PostCreateInput, PostUpdateInput } from '../inputs/post-input';
import { PaginatedPostResponse } from '../dtos/common';
import Post from '../entities/post-entity';
import { IPostRepository } from '../repositories/post-repository';
import { IUserRepository } from '../repositories/user-repository';
import { Transactional, Propagation } from 'typeorm-transactional';
import { BaseService } from './base-service';

export abstract class IPostService {
    abstract createPost(postCreate: PostCreateInput): Promise<Post>;

    abstract updatePost(postUpdate: PostUpdateInput): Promise<Post>;

    abstract deletePost(postId: number): Promise<string>;

    abstract list(page: number, pageSize: number): Promise<PaginatedPostResponse>;
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
}
