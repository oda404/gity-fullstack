import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
};

export type Query = {
  __typename?: 'Query';
  getSelfUser?: Maybe<User>;
  getUser?: Maybe<User>;
  getRepository?: Maybe<Repo>;
  getUserRepositories?: Maybe<Array<Repo>>;
};


export type QueryGetUserArgs = {
  username: Scalars['String'];
};


export type QueryGetRepositoryArgs = {
  name: Scalars['String'];
  owner: Scalars['String'];
};


export type QueryGetUserRepositoriesArgs = {
  start?: Maybe<Scalars['Int']>;
  count: Scalars['Int'];
  owner: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['String'];
  createdAt: Scalars['DateTime'];
  editedAt: Scalars['DateTime'];
  username: Scalars['String'];
  isEmailVerified: Scalars['Boolean'];
  repos?: Maybe<Array<Repo>>;
};


export type Repo = {
  __typename?: 'Repo';
  id: Scalars['String'];
  name: Scalars['String'];
  owner: User;
  createdAt: Scalars['DateTime'];
  editedAt: Scalars['DateTime'];
  description: Scalars['String'];
  likes: Scalars['Int'];
  isPrivate: Scalars['Boolean'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createUser: UserResponse;
  loginUser: UserResponse;
  logoutUser?: Maybe<Scalars['Boolean']>;
  deleteUser?: Maybe<Scalars['Boolean']>;
  updateUserEmail?: Maybe<Scalars['Boolean']>;
  updateUserPassword?: Maybe<Scalars['Boolean']>;
  generateInvitation?: Maybe<Scalars['String']>;
  createRepository?: Maybe<RepoResponse>;
  deleteRepository?: Maybe<Scalars['Boolean']>;
};


export type MutationCreateUserArgs = {
  userInput: UserRegisterInput;
};


export type MutationLoginUserArgs = {
  userInput: UserLoginInput;
};


export type MutationDeleteUserArgs = {
  password: Scalars['String'];
};


export type MutationUpdateUserEmailArgs = {
  newEmail: Scalars['String'];
  password: Scalars['String'];
};


export type MutationUpdateUserPasswordArgs = {
  newPassword: Scalars['String'];
  password: Scalars['String'];
};


export type MutationGenerateInvitationArgs = {
  password: Scalars['String'];
};


export type MutationCreateRepositoryArgs = {
  isPrivate: Scalars['Boolean'];
  name: Scalars['String'];
};


export type MutationDeleteRepositoryArgs = {
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

export type RepoResponse = {
  __typename?: 'RepoResponse';
  error?: Maybe<Scalars['String']>;
  repos?: Maybe<Array<Repo>>;
};

export type GenericRepoFragment = (
  { __typename?: 'Repo' }
  & Pick<Repo, 'id' | 'name' | 'likes' | 'isPrivate'>
);

export type GenericUserFragment = (
  { __typename?: 'User' }
  & Pick<User, 'id' | 'username'>
);

export type CreateRepositoryMutationVariables = Exact<{
  name: Scalars['String'];
  isPrivate: Scalars['Boolean'];
}>;


export type CreateRepositoryMutation = (
  { __typename?: 'Mutation' }
  & { createRepository?: Maybe<(
    { __typename?: 'RepoResponse' }
    & Pick<RepoResponse, 'error'>
    & { repos?: Maybe<Array<(
      { __typename?: 'Repo' }
      & GenericRepoFragment
    )>> }
  )> }
);

export type CreateUserMutationVariables = Exact<{
  userInput: UserRegisterInput;
}>;


export type CreateUserMutation = (
  { __typename?: 'Mutation' }
  & { createUser: (
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

export type DeleteRepositoryMutationVariables = Exact<{
  name: Scalars['String'];
  password: Scalars['String'];
}>;


export type DeleteRepositoryMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deleteRepository'>
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

export type GetRepositoryQueryVariables = Exact<{
  name: Scalars['String'];
  owner: Scalars['String'];
}>;


export type GetRepositoryQuery = (
  { __typename?: 'Query' }
  & { getRepository?: Maybe<(
    { __typename?: 'Repo' }
    & GenericRepoFragment
  )> }
);

export type GetSelfUserQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSelfUserQuery = (
  { __typename?: 'Query' }
  & { getSelfUser?: Maybe<(
    { __typename?: 'User' }
    & GenericUserFragment
  )> }
);

export type GetUserQueryVariables = Exact<{
  username: Scalars['String'];
}>;


export type GetUserQuery = (
  { __typename?: 'Query' }
  & { getUser?: Maybe<(
    { __typename?: 'User' }
    & GenericUserFragment
  )> }
);

export type GetUserRepositoriesQueryVariables = Exact<{
  owner: Scalars['String'];
  count: Scalars['Int'];
  start?: Maybe<Scalars['Int']>;
}>;


export type GetUserRepositoriesQuery = (
  { __typename?: 'Query' }
  & { getUserRepositories?: Maybe<Array<(
    { __typename?: 'Repo' }
    & GenericRepoFragment
  )>> }
);

export const GenericRepoFragmentDoc = gql`
    fragment GenericRepo on Repo {
  id
  name
  likes
  isPrivate
}
    `;
export const GenericUserFragmentDoc = gql`
    fragment GenericUser on User {
  id
  username
}
    `;
export const CreateRepositoryDocument = gql`
    mutation CreateRepository($name: String!, $isPrivate: Boolean!) {
  createRepository(name: $name, isPrivate: $isPrivate) {
    repos {
      ...GenericRepo
    }
    error
  }
}
    ${GenericRepoFragmentDoc}`;
export type CreateRepositoryMutationFn = Apollo.MutationFunction<CreateRepositoryMutation, CreateRepositoryMutationVariables>;

/**
 * __useCreateRepositoryMutation__
 *
 * To run a mutation, you first call `useCreateRepositoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateRepositoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createRepositoryMutation, { data, loading, error }] = useCreateRepositoryMutation({
 *   variables: {
 *      name: // value for 'name'
 *      isPrivate: // value for 'isPrivate'
 *   },
 * });
 */
export function useCreateRepositoryMutation(baseOptions?: Apollo.MutationHookOptions<CreateRepositoryMutation, CreateRepositoryMutationVariables>) {
        return Apollo.useMutation<CreateRepositoryMutation, CreateRepositoryMutationVariables>(CreateRepositoryDocument, baseOptions);
      }
export type CreateRepositoryMutationHookResult = ReturnType<typeof useCreateRepositoryMutation>;
export type CreateRepositoryMutationResult = Apollo.MutationResult<CreateRepositoryMutation>;
export type CreateRepositoryMutationOptions = Apollo.BaseMutationOptions<CreateRepositoryMutation, CreateRepositoryMutationVariables>;
export const CreateUserDocument = gql`
    mutation createUser($userInput: UserRegisterInput!) {
  createUser(userInput: $userInput) {
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
export type CreateUserMutationFn = Apollo.MutationFunction<CreateUserMutation, CreateUserMutationVariables>;

/**
 * __useCreateUserMutation__
 *
 * To run a mutation, you first call `useCreateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createUserMutation, { data, loading, error }] = useCreateUserMutation({
 *   variables: {
 *      userInput: // value for 'userInput'
 *   },
 * });
 */
export function useCreateUserMutation(baseOptions?: Apollo.MutationHookOptions<CreateUserMutation, CreateUserMutationVariables>) {
        return Apollo.useMutation<CreateUserMutation, CreateUserMutationVariables>(CreateUserDocument, baseOptions);
      }
export type CreateUserMutationHookResult = ReturnType<typeof useCreateUserMutation>;
export type CreateUserMutationResult = Apollo.MutationResult<CreateUserMutation>;
export type CreateUserMutationOptions = Apollo.BaseMutationOptions<CreateUserMutation, CreateUserMutationVariables>;
export const DeleteRepositoryDocument = gql`
    mutation DeleteRepository($name: String!, $password: String!) {
  deleteRepository(name: $name, password: $password)
}
    `;
export type DeleteRepositoryMutationFn = Apollo.MutationFunction<DeleteRepositoryMutation, DeleteRepositoryMutationVariables>;

/**
 * __useDeleteRepositoryMutation__
 *
 * To run a mutation, you first call `useDeleteRepositoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteRepositoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteRepositoryMutation, { data, loading, error }] = useDeleteRepositoryMutation({
 *   variables: {
 *      name: // value for 'name'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useDeleteRepositoryMutation(baseOptions?: Apollo.MutationHookOptions<DeleteRepositoryMutation, DeleteRepositoryMutationVariables>) {
        return Apollo.useMutation<DeleteRepositoryMutation, DeleteRepositoryMutationVariables>(DeleteRepositoryDocument, baseOptions);
      }
export type DeleteRepositoryMutationHookResult = ReturnType<typeof useDeleteRepositoryMutation>;
export type DeleteRepositoryMutationResult = Apollo.MutationResult<DeleteRepositoryMutation>;
export type DeleteRepositoryMutationOptions = Apollo.BaseMutationOptions<DeleteRepositoryMutation, DeleteRepositoryMutationVariables>;
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
export type LoginUserMutationFn = Apollo.MutationFunction<LoginUserMutation, LoginUserMutationVariables>;

/**
 * __useLoginUserMutation__
 *
 * To run a mutation, you first call `useLoginUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginUserMutation, { data, loading, error }] = useLoginUserMutation({
 *   variables: {
 *      userInput: // value for 'userInput'
 *   },
 * });
 */
export function useLoginUserMutation(baseOptions?: Apollo.MutationHookOptions<LoginUserMutation, LoginUserMutationVariables>) {
        return Apollo.useMutation<LoginUserMutation, LoginUserMutationVariables>(LoginUserDocument, baseOptions);
      }
export type LoginUserMutationHookResult = ReturnType<typeof useLoginUserMutation>;
export type LoginUserMutationResult = Apollo.MutationResult<LoginUserMutation>;
export type LoginUserMutationOptions = Apollo.BaseMutationOptions<LoginUserMutation, LoginUserMutationVariables>;
export const LogoutUserDocument = gql`
    mutation LogoutUser {
  logoutUser
}
    `;
export type LogoutUserMutationFn = Apollo.MutationFunction<LogoutUserMutation, LogoutUserMutationVariables>;

/**
 * __useLogoutUserMutation__
 *
 * To run a mutation, you first call `useLogoutUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutUserMutation, { data, loading, error }] = useLogoutUserMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutUserMutation(baseOptions?: Apollo.MutationHookOptions<LogoutUserMutation, LogoutUserMutationVariables>) {
        return Apollo.useMutation<LogoutUserMutation, LogoutUserMutationVariables>(LogoutUserDocument, baseOptions);
      }
export type LogoutUserMutationHookResult = ReturnType<typeof useLogoutUserMutation>;
export type LogoutUserMutationResult = Apollo.MutationResult<LogoutUserMutation>;
export type LogoutUserMutationOptions = Apollo.BaseMutationOptions<LogoutUserMutation, LogoutUserMutationVariables>;
export const GetRepositoryDocument = gql`
    query GetRepository($name: String!, $owner: String!) {
  getRepository(name: $owner, owner: $owner) {
    ...GenericRepo
  }
}
    ${GenericRepoFragmentDoc}`;

/**
 * __useGetRepositoryQuery__
 *
 * To run a query within a React component, call `useGetRepositoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRepositoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRepositoryQuery({
 *   variables: {
 *      name: // value for 'name'
 *      owner: // value for 'owner'
 *   },
 * });
 */
export function useGetRepositoryQuery(baseOptions: Apollo.QueryHookOptions<GetRepositoryQuery, GetRepositoryQueryVariables>) {
        return Apollo.useQuery<GetRepositoryQuery, GetRepositoryQueryVariables>(GetRepositoryDocument, baseOptions);
      }
export function useGetRepositoryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetRepositoryQuery, GetRepositoryQueryVariables>) {
          return Apollo.useLazyQuery<GetRepositoryQuery, GetRepositoryQueryVariables>(GetRepositoryDocument, baseOptions);
        }
export type GetRepositoryQueryHookResult = ReturnType<typeof useGetRepositoryQuery>;
export type GetRepositoryLazyQueryHookResult = ReturnType<typeof useGetRepositoryLazyQuery>;
export type GetRepositoryQueryResult = Apollo.QueryResult<GetRepositoryQuery, GetRepositoryQueryVariables>;
export const GetSelfUserDocument = gql`
    query GetSelfUser {
  getSelfUser {
    ...GenericUser
  }
}
    ${GenericUserFragmentDoc}`;

/**
 * __useGetSelfUserQuery__
 *
 * To run a query within a React component, call `useGetSelfUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSelfUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSelfUserQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetSelfUserQuery(baseOptions?: Apollo.QueryHookOptions<GetSelfUserQuery, GetSelfUserQueryVariables>) {
        return Apollo.useQuery<GetSelfUserQuery, GetSelfUserQueryVariables>(GetSelfUserDocument, baseOptions);
      }
export function useGetSelfUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSelfUserQuery, GetSelfUserQueryVariables>) {
          return Apollo.useLazyQuery<GetSelfUserQuery, GetSelfUserQueryVariables>(GetSelfUserDocument, baseOptions);
        }
export type GetSelfUserQueryHookResult = ReturnType<typeof useGetSelfUserQuery>;
export type GetSelfUserLazyQueryHookResult = ReturnType<typeof useGetSelfUserLazyQuery>;
export type GetSelfUserQueryResult = Apollo.QueryResult<GetSelfUserQuery, GetSelfUserQueryVariables>;
export const GetUserDocument = gql`
    query GetUser($username: String!) {
  getUser(username: $username) {
    ...GenericUser
  }
}
    ${GenericUserFragmentDoc}`;

/**
 * __useGetUserQuery__
 *
 * To run a query within a React component, call `useGetUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserQuery({
 *   variables: {
 *      username: // value for 'username'
 *   },
 * });
 */
export function useGetUserQuery(baseOptions: Apollo.QueryHookOptions<GetUserQuery, GetUserQueryVariables>) {
        return Apollo.useQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, baseOptions);
      }
export function useGetUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserQuery, GetUserQueryVariables>) {
          return Apollo.useLazyQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, baseOptions);
        }
export type GetUserQueryHookResult = ReturnType<typeof useGetUserQuery>;
export type GetUserLazyQueryHookResult = ReturnType<typeof useGetUserLazyQuery>;
export type GetUserQueryResult = Apollo.QueryResult<GetUserQuery, GetUserQueryVariables>;
export const GetUserRepositoriesDocument = gql`
    query GetUserRepositories($owner: String!, $count: Int!, $start: Int = 0) {
  getUserRepositories(owner: $owner, count: $count, start: $start) {
    ...GenericRepo
  }
}
    ${GenericRepoFragmentDoc}`;

/**
 * __useGetUserRepositoriesQuery__
 *
 * To run a query within a React component, call `useGetUserRepositoriesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserRepositoriesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserRepositoriesQuery({
 *   variables: {
 *      owner: // value for 'owner'
 *      count: // value for 'count'
 *      start: // value for 'start'
 *   },
 * });
 */
export function useGetUserRepositoriesQuery(baseOptions: Apollo.QueryHookOptions<GetUserRepositoriesQuery, GetUserRepositoriesQueryVariables>) {
        return Apollo.useQuery<GetUserRepositoriesQuery, GetUserRepositoriesQueryVariables>(GetUserRepositoriesDocument, baseOptions);
      }
export function useGetUserRepositoriesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserRepositoriesQuery, GetUserRepositoriesQueryVariables>) {
          return Apollo.useLazyQuery<GetUserRepositoriesQuery, GetUserRepositoriesQueryVariables>(GetUserRepositoriesDocument, baseOptions);
        }
export type GetUserRepositoriesQueryHookResult = ReturnType<typeof useGetUserRepositoriesQuery>;
export type GetUserRepositoriesLazyQueryHookResult = ReturnType<typeof useGetUserRepositoriesLazyQuery>;
export type GetUserRepositoriesQueryResult = Apollo.QueryResult<GetUserRepositoriesQuery, GetUserRepositoriesQueryVariables>;