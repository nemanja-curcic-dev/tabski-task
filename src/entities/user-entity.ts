import { CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, Column, Entity, OneToMany } from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';
import Post from './post-entity';

@ObjectType()
@Entity({
    name: 'users',
})
export default class User {
    @Field(() => ID)
    @PrimaryGeneratedColumn({})
    id: number;

    @Field(() => String)
    @Column('text', {
        nullable: false,
    })
    name: string;

    @Field(() => String)
    @Column('text', {
        nullable: false,
        unique: true,
    })
    email: string;

    @Column('text', {
        nullable: false,
    })
    password: string;

    @Field(() => [Post], {
        nullable: true
    })
    @OneToMany(() => Post, (post) => post.author)
    posts?: Post[];

    @Field(() => Date)
    @CreateDateColumn()
    created: Date;

    @Field(() => Date)
    @UpdateDateColumn()
    updated: Date;
}
