import { Field, InputType, ID } from 'type-graphql';
import { IsEmail, Length, IsStrongPassword, IsNotEmpty } from 'class-validator';

@InputType()
export class UserBaseInput {
    @Field(() => String, {
        nullable: false,
        description: 'Name of the user.',
    })
    @Length(2, 30)
    name: string;

    @Field(() => String, {
        nullable: false,
        description: 'Email address of the user.',
    })
    @IsEmail(undefined, {
        message: 'Must be a valid email!'
    })
    email: string;
}

@InputType()
export class UserCreateInput extends UserBaseInput {
    @Field(() => String, {
        nullable: false,
        description:
            'Password. Must be at least 8 characters long and contain at least one uppercase letter, lowercase letter, number and a symbol.',
    })
    @IsStrongPassword(
        {
            minLength: 8,
            minNumbers: 1,
            minLowercase: 1,
            minSymbols: 1,
            minUppercase: 1,
        },
        {
            message:
                'Password not strong enough. Must be at least 8 characters long and contain at least one uppercase letter, lowercase letter, number and a symbol.',
        }
    )
    password: string;

    @Field(() => String, {
        nullable: false,
        description: 'Must match with password.',
    })
    @IsStrongPassword({
        minLength: 8,
        minNumbers: 1,
        minLowercase: 1,
        minSymbols: 1,
        minUppercase: 1,
    })
    passwordConfirm: string;
}

@InputType()
export class UserUpdateInput extends UserBaseInput {
    @Field(() => ID, {
        nullable: false,
        description: 'ID of a user being updated.'
    })
    @IsNotEmpty()
    id: number;
}
