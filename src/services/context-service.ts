import DataLoader, { BatchLoadFn } from 'dataloader';
import { IPostRepository } from '../repositories/post-repository';
import Post from '../entities/post-entity';
import { Service } from 'typedi';
import User from '../entities/user-entity';
import { UserRepository } from '../repositories/user-repository';

export interface CustomContext {
    loaders: {
        postLoader: DataLoader<number, Post[]>,
        userLoader: DataLoader<number, User>
    }
}

export abstract class IContextService {
    abstract createContext(): CustomContext;
}

@Service()
export class ContextService implements IContextService {
    constructor(private postRepository: IPostRepository, private userRepository: UserRepository) {}

    private postsBatchFn: BatchLoadFn<number, Post[]> = async (authorIds) => {
        // Fetch the posts for the given author IDs
        const posts = await this.postRepository.listPostsByAuthorIds(authorIds as number[]);

        // Group the posts by author ID
        const postsByAuthor: { [key: number]: Post[] } = {};
        posts.forEach((post) => {
            if (postsByAuthor[post.author.id]) {
                postsByAuthor[post.author.id].push(post);
            } else {
                postsByAuthor[post.author.id] = [post];
            }
        });

        // Return the posts in the same order as the author IDs
        const result = authorIds.map((authorId) => postsByAuthor[authorId] || []);
        return result;
    };

    private usersBatchFn: BatchLoadFn<number, User> = async (postIds) => {
        const authors = await this.userRepository.listUsersByPostIds(postIds as number[]);

        const postIdsMap: {[key:number]: number} = {};
        postIds.forEach(pid => {
            if (postIdsMap[pid] == undefined) {
                postIdsMap[pid] = pid;
            }
        });

        const authorsMap: {[key: number]: User} = {};
        authors.forEach(author => {
            author.posts?.forEach(p => {
                if (postIdsMap[p.id] != undefined) {
                    authorsMap[p.id] = author;
                }
            });
        });

        return postIds.map(pid => authorsMap[pid]);
    };

    public createContext(): CustomContext {
        const postLoader = new DataLoader(this.postsBatchFn);
        const userLoader = new DataLoader(this.usersBatchFn);

        return {
            loaders: {
                postLoader: postLoader,
                userLoader: userLoader
            }
        };
    }
}

