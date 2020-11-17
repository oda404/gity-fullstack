import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Query = {
  __typename?: 'Query';
  getMyself?: Maybe<User>;
  loginUser: UserResponse;
};


export type QueryLoginUserArgs = {
  userInput: UserLoginInput;
};

export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  createdAt: Scalars['String'];
  editedAt: Scalars['String'];
  username: Scalars['String'];
  email: Scalars['String'];
  isEmailVerified: Scalars['Boolean'];
  repos: Array<Scalars['String']>;
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<UserFieldError>>;
  user?: Maybe<User>;
};

export type UserFieldError = {
  __typename?: 'UserFieldError';
  field: Scalars['String'];
  error: Scalars['String'];
};

export type UserLoginInput = {
  usernameOrEmail: Scalars['String'];
  password: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  registerUser: UserResponse;
  addRepo: RepoResponse;
  deleteRepo: Scalars['Boolean'];
};


export type MutationRegisterUserArgs = {
  userInput: UserRegisterInput;
};

export type UserRegisterInput = {
  username: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
  invitation: Scalars['String'];
};

export type RepoResponse = {
  __typename?: 'RepoResponse';
  errors?: Maybe<Array<Scalars['String']>>;
  repo: Repo;
};

export type Repo = {
  __typename?: 'Repo';
  id: Scalars['ID'];
  name: Scalars['String'];
  owner: Scalars['String'];
  createdAt: Scalars['String'];
  modifiedAt: Scalars['String'];
  privileged: Array<Scalars['String']>;
  description: Scalars['String'];
  commits: Scalars['Int'];
  likes: Scalars['Int'];
};

export type RegisterUserMutationVariables = Exact<{
  username: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
  invitation: Scalars['String'];
}>;


export type RegisterUserMutation = (
  { __typename?: 'Mutation' }
  & { registerUser: (
    { __typename?: 'UserResponse' }
    & { errors?: Maybe<Array<(
      { __typename?: 'UserFieldError' }
      & Pick<UserFieldError, 'field' | 'error'>
    )>>, user?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'id'>
    )> }
  ) }
);


export const RegisterUserDocument = gql`
    mutation RegisterUser($username: String!, $email: String!, $password: String!, $invitation: String!) {
  registerUser(
    userInput: {username: $username, email: $email, password: $password, invitation: $invitation}
  ) {
    errors {
      field
      error
    }
    user {
      id
    }
  }
}
    `;

export function useRegisterUserMutation() {
  return Urql.useMutation<RegisterUserMutation, RegisterUserMutationVariables>(RegisterUserDocument);
};