import User from '../../entities/user-entity';
import Post from '../../entities/post-entity';

interface CreateUser {
    name?: string;
    email?: string;
    password?: string;
}

interface CreatePost {
    title?: string;
    content?: string;
    author?: User;
    numberOfLikes?: number
}

export function createUser(input: CreateUser): User {
    const user = new User();

    user.name = input.name || 'Test name';
    user.email = input.email || 'test@email.com';
    user.password = input.password || 'password';

    return user;
}

export function createPost(input: CreatePost, author: User): Post {
    const post = new Post();

    post.title = input.title || 'Title';
    post.content = input.content || 'Content';
    post.author = author;
    post.numberOfLikes = input.numberOfLikes || 0;

    return post;
}
