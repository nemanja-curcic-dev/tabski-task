import { Service, Container } from 'typedi';
import { Repository, DataSource, In } from 'typeorm';
import Post from '../entities/post-entity';
import { LogMethodCalled, logger } from '../misc/logger';

export abstract class IPostRepository {
    abstract listPosts(page: number, pageSize: number): Promise<[Post[], number]>;

    abstract savePost(post: Post): Promise<Post>;

    abstract getPostById(id: number): Promise<Post | null>;

    abstract deletePost(post: Post): Promise<void>;

    abstract listPostsByAuthorIds(authorIds: readonly number[]): Promise<Post[]>;
}

@Service()
export class PostRepository implements IPostRepository {
    private repository: Repository<Post>;

    constructor() {
        this.repository = Container.get(DataSource).getRepository(Post);
    }

    @LogMethodCalled
    public async savePost(post: Post): Promise<Post> {
        logger.debug(`Saving post with title ${post.title}...`);
        return await this.repository.save(post);
    }

    @LogMethodCalled
    public async getPostById(id: number): Promise<Post | null> {
        logger.debug(`Getting post with id ${id}...`);
        return await this.repository.findOne({
            where: {
                id: id,
            },
        });
    }

    @LogMethodCalled
    public async deletePost(post: Post): Promise<void> {
        logger.debug(`Deleting post with id ${post.id}...`);
        await this.repository.remove(post);
    }

    @LogMethodCalled
    public async listPosts(page: number, pageSize: number): Promise<[Post[], number]> {
        logger.debug(`Listing posts - page: ${page}, pageSize: ${pageSize}`);
        return await this.repository.findAndCount({
            skip: (page - 1) * pageSize,
            take: pageSize,
        });
    }

    @LogMethodCalled
    public async listPostsByAuthorIds(authorIds: number[]): Promise<Post[]> {
        logger.debug(`Listing posts by author ids: ${JSON.stringify(authorIds)}...`);
        return await this.repository.find({
            where: {
                author: {
                    id: In(authorIds),
                },
            },
            relations: ['author']
        });
    }
}