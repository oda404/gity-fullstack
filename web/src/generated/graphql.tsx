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
  getRepo: RepoResponse;
};


export type QueryGetRepoArgs = {
  name: Scalars['String'];
  owner: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['String'];
  editedAt: Scalars['String'];
  username: Scalars['String'];
  email: Scalars['String'];
  isEmailVerified: Scalars['Boolean'];
  reposId: Array<Scalars['String']>;
};

export type RepoResponse = {
  __typename?: 'RepoResponse';
  error?: Maybe<Scalars['String']>;
  repos: Array<Repo>;
};

export type Repo = {
  __typename?: 'Repo';
  name: Scalars['String'];
  owner: Scalars['String'];
  createdAt: Scalars['String'];
  editedAt: Scalars['String'];
  description: Scalars['String'];
  likes: Scalars['Int'];
};

export type Mutation = {
  __typename?: 'Mutation';
  registerUser: UserResponse;
  loginUser: UserResponse;
  logoutUser?: Maybe<Scalars['Boolean']>;
  deleteUser?: Maybe<Scalars['Boolean']>;
  changeUserEmail?: Maybe<Scalars['Boolean']>;
  changeUserPassword?: Maybe<Scalars['Boolean']>;
  forgotUserPassword?: Maybe<Scalars['Boolean']>;
  createRepo?: Maybe<RepoResponse>;
  deleteRepo?: Maybe<Scalars['Boolean']>;
};


export type MutationRegisterUserArgs = {
  userInput: UserRegisterInput;
};


export type MutationLoginUserArgs = {
  userInput: UserLoginInput;
};


export type MutationDeleteUserArgs = {
  password: Scalars['String'];
};


export type MutationChangeUserEmailArgs = {
  newEmail: Scalars['String'];
  password: Scalars['String'];
};


export type MutationChangeUserPasswordArgs = {
  newPassword: Scalars['String'];
  password: Scalars['String'];
};


export type MutationForgotUserPasswordArgs = {
  email: Scalars['String'];
};


export type MutationCreateRepoArgs = {
  isPrivate: Scalars['Boolean'];
  name: Scalars['String'];
};


export type MutationDeleteRepoArgs = {
  name: Scalars['String'];
  password: Scalars['String'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  error?: Maybe<UserFieldError>;
  user?: Maybe<User>;
};

export type UserFieldError = {
  __typename?: 'UserFieldError';
  field: Scalars['String'];
  message: Scalars['String'];
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

export type GenericUserFragment = (
  { __typename?: 'User' }
  & Pick<User, 'username'>
);

export type CreateRepoMutationVariables = Exact<{
  name: Scalars['String'];
  isPrivate: Scalars['Boolean'];
}>;


export type CreateRepoMutation = (
  { __typename?: 'Mutation' }
  & { createRepo?: Maybe<(
    { __typename?: 'RepoResponse' }
    & Pick<RepoResponse, 'error'>
    & { repos: Array<(
      { __typename?: 'Repo' }
      & Pick<Repo, 'name'>
    )> }
  )> }
);

export type DeleteRepoMutationVariables = Exact<{
  name: Scalars['String'];
  password: Scalars['String'];
}>;


export type DeleteRepoMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deleteRepo'>
);

export type LoginUserMutationVariables = Exact<{
  userInput: UserLoginInput;
}>;


export type LoginUserMutation = (
  { __typename?: 'Mutation' }
  & { loginUser: (
    { __typename?: 'UserResponse' }
    & { error?: Maybe<(
      { __typename?: 'UserFieldError' }
      & Pick<UserFieldError, 'field' | 'message'>
    )>, user?: Maybe<(
      { __typename?: 'User' }
      & GenericUserFragment
    )> }
  ) }
);

export type LogoutUserMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutUserMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'logoutUser'>
);

export type RegisterUserMutationVariables = Exact<{
  userInput: UserRegisterInput;
}>;


export type RegisterUserMutation = (
  { __typename?: 'Mutation' }
  & { registerUser: (
    { __typename?: 'UserResponse' }
    & { error?: Maybe<(
      { __typename?: 'UserFieldError' }
      & Pick<UserFieldError, 'field' | 'message'>
    )>, user?: Maybe<(
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
    & GenericUserFragment
  )> }
);

export const GenericUserFragmentDoc = gql`
    fragment GenericUser on User {
  username
}
    `;
export const CreateRepoDocument = gql`
    mutation CreateRepo($name: String!, $isPrivate: Boolean!) {
  createRepo(name: $name, isPrivate: $isPrivate) {
    error
    repos {
      name
    }
  }
}
    `;

export function useCreateRepoMutation() {
  return Urql.useMutation<CreateRepoMutation, CreateRepoMutationVariables>(CreateRepoDocument);
};
export const DeleteRepoDocument = gql`
    mutation DeleteRepo($name: String!, $password: String!) {
  deleteRepo(name: $name, password: $password)
}
    `;

export function useDeleteRepoMutation() {
  return Urql.useMutation<DeleteRepoMutation, DeleteRepoMutationVariables>(DeleteRepoDocument);
};
export const LoginUserDocument = gql`
    mutation LoginUser($userInput: UserLoginInput!) {
  loginUser(userInput: $userInput) {
    error {
      field
      message
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
export const LogoutUserDocument = gql`
    mutation LogoutUser {
  logoutUser
}
    `;

export function useLogoutUserMutation() {
  return Urql.useMutation<LogoutUserMutation, LogoutUserMutationVariables>(LogoutUserDocument);
};
export const RegisterUserDocument = gql`
    mutation RegisterUser($userInput: UserRegisterInput!) {
  registerUser(userInput: $userInput) {
    error {
      field
      message
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
    ...GenericUser
  }
}
    ${GenericUserFragmentDoc}`;

export function useSelfQuery(options: Omit<Urql.UseQueryArgs<SelfQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<SelfQuery>({ query: SelfDocument, ...options });
};