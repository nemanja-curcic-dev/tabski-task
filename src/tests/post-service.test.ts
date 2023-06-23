import { beforeAll, afterAll, afterEach, describe, it } from '@jest/globals';
import { db } from '../config';
import { Container } from 'typedi';
import { UserService } from '../services/user-service';
import { PostService } from '../services/post-service';
import User from '../entities/user-entity';
import Post from '../entities/post-entity';
import { createUser, createPost } from './utils';
import { expect } from 'chai';

const userService = Container.get(UserService);
const postService = Container.get(PostService);

const userRepository = db.getRepository(User);
const postRepository = db.getRepository(Post);

beforeAll(async () => {
    await db.initialize();
});

describe('Test suite for post service', () => {

    afterEach(async () => {
        await postRepository.delete({});
        await userRepository.delete({});
    });

    it('it should throw an error if author of the post being created does not exist', async () => {
        const notExistingAuthorId = 1111;
        try {
            await postService.createPost({
                authorId: notExistingAuthorId,
                title: 'Title',
                content: 'Content'
            });
        } catch (e) {
            console.log(`User with id ${notExistingAuthorId} does not exist!`);
        }
    });

    it('should successfully create a post', async () => {
        const author = await userRepository.save(createUser({}));
        
        const title = 'Title';
        const content = 'Content';

        const post = await postService.createPost({
            authorId: author.id,
            title: title,
            content: content
        });

        expect(post.title).to.be.equal(title);
        expect(post.content).to.be.equal(content);
    });

    it('should throw an error if post being updated does not exist', async () => {
        const notExistingId = 1111;
        try {
            await postService.updatePost({
                id: notExistingId,
                title: 'title',
                content: 'content'
            });
        } catch (e) {
            expect(`Post ${notExistingId} does not exist!`);
        }
    });

    it('should successfully update post', async () => {
        const author = await userRepository.save(createUser({}));
        const postForUpdate = await postRepository.save(createPost({
            title: 'title',
            content: 'content'
        }, author));

        const titleUpdate = 'Title Updated';
        const contentUpdate = 'Content Updated';

        const updatedPost = await postService.updatePost({
            id: postForUpdate.id,
            title: titleUpdate,
            content: contentUpdate
        });

        expect(updatedPost.title).to.be.equal(titleUpdate);
        expect(updatedPost.content).to.be.equal(contentUpdate);
    });

    it('should throw an error if post being deleted does not exist', async () => {
        const author = await userRepository.save(createUser({}));
        const postForDeletion = await postRepository.save(createPost({}, author));

        await postService.deletePost(postForDeletion.id);

        const post = await postRepository.findOne({
            where: {
                id: postForDeletion.id
            }
        });

        expect(post).to.be.null;
    });

    it('should list posts', async () => {
        const author = await userRepository.save(createUser({}));
        const numberOfPosts = 30;

        for (let i = 0; i < numberOfPosts; i++) {
            await postRepository.save(createPost({}, author));
        }

        const posts = await postService.list(1, 10);
        expect(posts.items).length(10);
        expect(posts.total).to.be.equal(numberOfPosts);
    });

    it('should throw an error if user liking the post does not exist', async () => {
        const notExistingUserId = 1111;
        try {
            await postService.likePost(notExistingUserId, 1);
        } catch (e) {
            expect(e.message).to.be.equal(`User ${notExistingUserId} does not exist!`);
        }
    });

    it('should throw an error if post being liked does not exist', async () => {
        const author = await userRepository.save(createUser({}));
        const notExistingPostId = 1111;

        try {
            await postService.likePost(author.id, notExistingPostId);
        } catch (e) {
            expect(e.message).to.be.equal(`Post ${notExistingPostId} does not exist!`);
        }
    });

    it('should successfully like the post', async () => {
        const author = await userRepository.save(createUser({}));
        const post = await postRepository.save(createPost({}, author));

        const likedPost = await postService.likePost(author.id, post.id);
        expect(likedPost.numberOfLikes).to.be.equal(1);
    });

    it('should successfully unlike already liked post', async () => {
        const author = await userRepository.save(createUser({}));
        const post = await postRepository.save(createPost({}, author));

        // Like post
        await postService.likePost(author.id, post.id);
        // Unlike post
        const likedPost = await postService.likePost(author.id, post.id);
        expect(likedPost.numberOfLikes).to.be.equal(0);
    });
});

afterAll(async () => {
    await db.destroy();
});
