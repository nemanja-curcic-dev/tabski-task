import { Service, Container } from 'typedi';
import { Repository, DataSource } from 'typeorm';
import Post from '../entities/post-entity';
import { LogMethodCalled } from '../misc/logger';

export abstract class IPostRepository {
    abstract listPosts(page: number, pageSize: number): Promise<[Post[], number]>;

    abstract savePost(post: Post): Promise<Post>;

    abstract getPostById(id: number): Promise<Post | null>;

    abstract deletePost(post: Post): Promise<void>;
}

@Service()
export class PostRepository implements IPostRepository {
    private repository: Repository<Post>;

    constructor() {
        this.repository = Container.get(DataSource).getRepository(Post);
    }

    @LogMethodCalled
    public async savePost(post: Post): Promise<Post> {
        return await this.repository.save(post);
    }

    @LogMethodCalled
    public async getPostById(id: number): Promise<Post | null> {
        return await this.repository.findOne({
            where: {
                id: id,
            },
        });
    }

    @LogMethodCalled
    public async deletePost(post: Post): Promise<void> {
        await this.repository.remove(post);
    }

    @LogMethodCalled
    public async listPosts(page: number, pageSize: number): Promise<[Post[], number]> {
        return await this.repository.findAndCount({
            skip: (page - 1) * pageSize,
            take: pageSize,
        });
    }
}