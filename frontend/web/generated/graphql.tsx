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
  self?: Maybe<User>;
  getUser?: Maybe<User>;
  getRepo?: Maybe<Repo>;
  getUserRepos?: Maybe<Array<Repo>>;
};


export type QueryGetUserArgs = {
  username: Scalars['String'];
};


export type QueryGetRepoArgs = {
  name: Scalars['String'];
  owner: Scalars['String'];
};


export type QueryGetUserReposArgs = {
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
  registerUser: UserResponse;
  loginUser: UserResponse;
  logoutUser?: Maybe<Scalars['Boolean']>;
  deleteUser?: Maybe<Scalars['Boolean']>;
  changeUserEmail?: Maybe<Scalars['Boolean']>;
  changeUserPassword?: Maybe<Scalars['Boolean']>;
  generateInvitation?: Maybe<Scalars['String']>;
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


export type MutationGenerateInvitationArgs = {
  password: Scalars['String'];
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

export type CreateRepoMutationVariables = Exact<{
  name: Scalars['String'];
  isPrivate: Scalars['Boolean'];
}>;


export type CreateRepoMutation = (
  { __typename?: 'Mutation' }
  & { createRepo?: Maybe<(
    { __typename?: 'RepoResponse' }
    & Pick<RepoResponse, 'error'>
    & { repos?: Maybe<Array<(
      { __typename?: 'Repo' }
      & GenericRepoFragment
    )>> }
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

export type GetRepoQueryVariables = Exact<{
  name: Scalars['String'];
  owner: Scalars['String'];
}>;


export type GetRepoQuery = (
  { __typename?: 'Query' }
  & { getRepo?: Maybe<(
    { __typename?: 'Repo' }
    & GenericRepoFragment
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

export type GetUserReposQueryVariables = Exact<{
  owner: Scalars['String'];
  count: Scalars['Int'];
  start?: Maybe<Scalars['Int']>;
}>;


export type GetUserReposQuery = (
  { __typename?: 'Query' }
  & { getUserRepos?: Maybe<Array<(
    { __typename?: 'Repo' }
    & GenericRepoFragment
  )>> }
);

export type SelfQueryVariables = Exact<{ [key: string]: never; }>;


export type SelfQuery = (
  { __typename?: 'Query' }
  & { self?: Maybe<(
    { __typename?: 'User' }
    & GenericUserFragment
  )> }
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
export const CreateRepoDocument = gql`
    mutation CreateRepo($name: String!, $isPrivate: Boolean!) {
  createRepo(name: $name, isPrivate: $isPrivate) {
    repos {
      ...GenericRepo
    }
    error
  }
}
    ${GenericRepoFragmentDoc}`;
export type CreateRepoMutationFn = Apollo.MutationFunction<CreateRepoMutation, CreateRepoMutationVariables>;

/**
 * __useCreateRepoMutation__
 *
 * To run a mutation, you first call `useCreateRepoMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateRepoMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createRepoMutation, { data, loading, error }] = useCreateRepoMutation({
 *   variables: {
 *      name: // value for 'name'
 *      isPrivate: // value for 'isPrivate'
 *   },
 * });
 */
export function useCreateRepoMutation(baseOptions?: Apollo.MutationHookOptions<CreateRepoMutation, CreateRepoMutationVariables>) {
        return Apollo.useMutation<CreateRepoMutation, CreateRepoMutationVariables>(CreateRepoDocument, baseOptions);
      }
export type CreateRepoMutationHookResult = ReturnType<typeof useCreateRepoMutation>;
export type CreateRepoMutationResult = Apollo.MutationResult<CreateRepoMutation>;
export type CreateRepoMutationOptions = Apollo.BaseMutationOptions<CreateRepoMutation, CreateRepoMutationVariables>;
export const DeleteRepoDocument = gql`
    mutation DeleteRepo($name: String!, $password: String!) {
  deleteRepo(name: $name, password: $password)
}
    `;
export type DeleteRepoMutationFn = Apollo.MutationFunction<DeleteRepoMutation, DeleteRepoMutationVariables>;

/**
 * __useDeleteRepoMutation__
 *
 * To run a mutation, you first call `useDeleteRepoMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteRepoMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteRepoMutation, { data, loading, error }] = useDeleteRepoMutation({
 *   variables: {
 *      name: // value for 'name'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useDeleteRepoMutation(baseOptions?: Apollo.MutationHookOptions<DeleteRepoMutation, DeleteRepoMutationVariables>) {
        return Apollo.useMutation<DeleteRepoMutation, DeleteRepoMutationVariables>(DeleteRepoDocument, baseOptions);
      }
export type DeleteRepoMutationHookResult = ReturnType<typeof useDeleteRepoMutation>;
export type DeleteRepoMutationResult = Apollo.MutationResult<DeleteRepoMutation>;
export type DeleteRepoMutationOptions = Apollo.BaseMutationOptions<DeleteRepoMutation, DeleteRepoMutationVariables>;
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
export type RegisterUserMutationFn = Apollo.MutationFunction<RegisterUserMutation, RegisterUserMutationVariables>;

/**
 * __useRegisterUserMutation__
 *
 * To run a mutation, you first call `useRegisterUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerUserMutation, { data, loading, error }] = useRegisterUserMutation({
 *   variables: {
 *      userInput: // value for 'userInput'
 *   },
 * });
 */
export function useRegisterUserMutation(baseOptions?: Apollo.MutationHookOptions<RegisterUserMutation, RegisterUserMutationVariables>) {
        return Apollo.useMutation<RegisterUserMutation, RegisterUserMutationVariables>(RegisterUserDocument, baseOptions);
      }
export type RegisterUserMutationHookResult = ReturnType<typeof useRegisterUserMutation>;
export type RegisterUserMutationResult = Apollo.MutationResult<RegisterUserMutation>;
export type RegisterUserMutationOptions = Apollo.BaseMutationOptions<RegisterUserMutation, RegisterUserMutationVariables>;
export const GetRepoDocument = gql`
    query GetRepo($name: String!, $owner: String!) {
  getRepo(name: $owner, owner: $owner) {
    ...GenericRepo
  }
}
    ${GenericRepoFragmentDoc}`;

/**
 * __useGetRepoQuery__
 *
 * To run a query within a React component, call `useGetRepoQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRepoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRepoQuery({
 *   variables: {
 *      name: // value for 'name'
 *      owner: // value for 'owner'
 *   },
 * });
 */
export function useGetRepoQuery(baseOptions: Apollo.QueryHookOptions<GetRepoQuery, GetRepoQueryVariables>) {
        return Apollo.useQuery<GetRepoQuery, GetRepoQueryVariables>(GetRepoDocument, baseOptions);
      }
export function useGetRepoLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetRepoQuery, GetRepoQueryVariables>) {
          return Apollo.useLazyQuery<GetRepoQuery, GetRepoQueryVariables>(GetRepoDocument, baseOptions);
        }
export type GetRepoQueryHookResult = ReturnType<typeof useGetRepoQuery>;
export type GetRepoLazyQueryHookResult = ReturnType<typeof useGetRepoLazyQuery>;
export type GetRepoQueryResult = Apollo.QueryResult<GetRepoQuery, GetRepoQueryVariables>;
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
export const GetUserReposDocument = gql`
    query GetUserRepos($owner: String!, $count: Int!, $start: Int = 0) {
  getUserRepos(owner: $owner, count: $count, start: $start) {
    ...GenericRepo
  }
}
    ${GenericRepoFragmentDoc}`;

/**
 * __useGetUserReposQuery__
 *
 * To run a query within a React component, call `useGetUserReposQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserReposQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserReposQuery({
 *   variables: {
 *      owner: // value for 'owner'
 *      count: // value for 'count'
 *      start: // value for 'start'
 *   },
 * });
 */
export function useGetUserReposQuery(baseOptions: Apollo.QueryHookOptions<GetUserReposQuery, GetUserReposQueryVariables>) {
        return Apollo.useQuery<GetUserReposQuery, GetUserReposQueryVariables>(GetUserReposDocument, baseOptions);
      }
export function useGetUserReposLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserReposQuery, GetUserReposQueryVariables>) {
          return Apollo.useLazyQuery<GetUserReposQuery, GetUserReposQueryVariables>(GetUserReposDocument, baseOptions);
        }
export type GetUserReposQueryHookResult = ReturnType<typeof useGetUserReposQuery>;
export type GetUserReposLazyQueryHookResult = ReturnType<typeof useGetUserReposLazyQuery>;
export type GetUserReposQueryResult = Apollo.QueryResult<GetUserReposQuery, GetUserReposQueryVariables>;
export const SelfDocument = gql`
    query Self {
  self {
    ...GenericUser
  }
}
    ${GenericUserFragmentDoc}`;

/**
 * __useSelfQuery__
 *
 * To run a query within a React component, call `useSelfQuery` and pass it any options that fit your needs.
 * When your component renders, `useSelfQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSelfQuery({
 *   variables: {
 *   },
 * });
 */
export function useSelfQuery(baseOptions?: Apollo.QueryHookOptions<SelfQuery, SelfQueryVariables>) {
        return Apollo.useQuery<SelfQuery, SelfQueryVariables>(SelfDocument, baseOptions);
      }
export function useSelfLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SelfQuery, SelfQueryVariables>) {
          return Apollo.useLazyQuery<SelfQuery, SelfQueryVariables>(SelfDocument, baseOptions);
        }
export type SelfQueryHookResult = ReturnType<typeof useSelfQuery>;
export type SelfLazyQueryHookResult = ReturnType<typeof useSelfLazyQuery>;
export type SelfQueryResult = Apollo.QueryResult<SelfQuery, SelfQueryVariables>;