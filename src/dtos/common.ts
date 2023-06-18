import { Int, ObjectType, Field } from 'type-graphql';
import User from '../entities/user-entity';

@ObjectType()
export class PaginatedResponse {
    @Field(() => Int)
    total: number;

    @Field(() => Int)
    page: number;

    @Field(() => Int)
    pageSize: number;
}

@ObjectType()
export class PaginatedUserResponse extends PaginatedResponse {
    @Field(() => [User])
    items: User[];
}
