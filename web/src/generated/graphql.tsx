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
  self?: Maybe<User>;
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

export type Mutation = {
  __typename?: 'Mutation';
  registerUser: UserResponse;
  loginUser: UserResponse;
  addRepo: RepoResponse;
  deleteRepo: Scalars['Boolean'];
};


export type MutationRegisterUserArgs = {
  userInput: UserRegisterInput;
};


export type MutationLoginUserArgs = {
  userInput: UserLoginInput;
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

export type UserRegisterInput = {
  username: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
  invitation: Scalars['String'];
};

export type UserLoginInput = {
  usernameOrEmail: Scalars['String'];
  password: Scalars['String'];
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

export type GenericUserFragment = (
  { __typename?: 'User' }
  & Pick<User, 'id' | 'username'>
);

export type LoginUserMutationVariables = Exact<{
  usernameOrEmail: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginUserMutation = (
  { __typename?: 'Mutation' }
  & { loginUser: (
    { __typename?: 'UserResponse' }
    & { errors?: Maybe<Array<(
      { __typename?: 'UserFieldError' }
      & Pick<UserFieldError, 'field' | 'error'>
    )>>, user?: Maybe<(
      { __typename?: 'User' }
      & GenericUserFragment
    )> }
  ) }
);

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
      & GenericUserFragment
    )> }
  ) }
);

export type SelfQueryVariables = Exact<{ [key: string]: never; }>;


export type SelfQuery = (
  { __typename?: 'Query' }
  & { self?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'username'>
  )> }
);

export const GenericUserFragmentDoc = gql`
    fragment GenericUser on User {
  id
  username
}
    `;
export const LoginUserDocument = gql`
    mutation LoginUser($usernameOrEmail: String!, $password: String!) {
  loginUser(userInput: {usernameOrEmail: $usernameOrEmail, password: $password}) {
    errors {
      field
      error
    }
    user {
      ...GenericUser
    }
  }
}
    ${GenericUserFragmentDoc}`;

export function useLoginUserMutation() {
  return Urql.useMutation<LoginUserMutation, LoginUserMutationVariables>(LoginUserDocument);
};
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
      ...GenericUser
    }
  }
}
    ${GenericUserFragmentDoc}`;

export function useRegisterUserMutation() {
  return Urql.useMutation<RegisterUserMutation, RegisterUserMutationVariables>(RegisterUserDocument);
};
export const SelfDocument = gql`
    query Self {
  self {
    id
    username
  }
}
    `;

export function useSelfQuery(options: Omit<Urql.UseQueryArgs<SelfQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<SelfQuery>({ query: SelfDocument, ...options });
};