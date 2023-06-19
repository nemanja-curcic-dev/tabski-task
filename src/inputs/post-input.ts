import { InputType, Field, ID } from 'type-graphql';
import { Length, IsNotEmpty } from 'class-validator';

@InputType()
export class PostBaseInput {
    @Field(() => String, {
        nullable: false,
        description: 'Title of the post.',
    })
    @Length(2, 300)
    title: string;

    @Field(() => String, {
        nullable: false,
        description: 'Content of the post.'
    })
    @Length(1, 20000)
    content: string;
}

@InputType()
export class PostCreateInput extends PostBaseInput {
    @Field(() => ID, {
        description: 'ID of the author.'
    })
    @IsNotEmpty()
    authorId: number;
}

@InputType()
export class PostUpdateInput extends PostBaseInput {
    @Field(() => ID, {
        description: 'ID of the post.'
    })
    @IsNotEmpty()
    id: number;
}