import { CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, Entity, Column, ManyToOne } from 'typeorm';
import { Field, ObjectType, ID } from 'type-graphql';
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

    @ManyToOne(() => User, (user) => user.posts, { onDelete: 'CASCADE' })
    author: User;

    @Field(() => Date)
    @CreateDateColumn()
    created: Date;

    @Field(() => Date)
    @UpdateDateColumn()
    updated: Date;
}
