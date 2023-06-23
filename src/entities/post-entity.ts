import { CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, Entity, Column, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { Field, ObjectType, ID, Int } from 'type-graphql';
import User from './user-entity';

@ObjectType()
@Entity({
    name: 'posts',
})
export default class Post {
    @Field(() => ID)
    @PrimaryGeneratedColumn({})
    id: number;

    @Field(() => String)
    @Column('text', {
        nullable: false,
    })
    title: string;

    @Field(() => String)
    @Column('text', {
        nullable: false,
    })
    content: string;

    @Field(() => User)
    @ManyToOne(() => User, (user) => user.posts, { onDelete: 'CASCADE' })
    author: User;

    @Field(() => Int)
    @Column('integer', {
        nullable: true,
        default: 0
    })
    numberOfLikes: number;

    @ManyToMany(() => User, (user) => user.likes)
    @JoinTable({
        name: 'likes'
    })
    likes: User[];

    @Field(() => Date)
    @CreateDateColumn()
    created: Date;

    @Field(() => Date)
    @UpdateDateColumn()
    updated: Date;
}
