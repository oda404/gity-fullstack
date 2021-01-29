global.fetch = require("node-fetch");
import {
  ApolloClient,
  ApolloLink,
  createHttpLink,
  from,
  InMemoryCache,
  NextLink,
  Operation
} from "@apollo/client/core";
import { 
  UserRegisterInput, 
  CreateUserDocument, 
  UserLoginInput, 
  LoginUserDocument, 
  GenerateInvitationDocument,
  LogoutUserDocument,
  DeleteUserDocument,
  GetSelfUserDocument,
  GetUserDocument
} from "./generated/graphql";

function createApolloClient()
{
  const beforeLink = new ApolloLink((op: Operation, forward: NextLink) => {
    op.setContext({
      headers: {
        cookie: op.getContext().cookie
      }
    });
    return forward(op);
  })

  const afterLink = new ApolloLink((op: Operation, forward: NextLink) => {
    return forward(op).map(response => {
      const context = op.getContext();
      response.context = { headers: new Map<string, string>(context.response.headers) }
      return response;
    });
  });

  return new ApolloClient({
    ssrMode: true,
    link: from([beforeLink, afterLink, createHttpLink({
      uri: "http://localhost:4200"
    })]),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: "no-cache",
        errorPolicy: "ignore"
      },
      query: {
        fetchPolicy: "no-cache",
        errorPolicy: "all"
      }
    }
  });
}

/*
  These tests assume that the api is using the default configs,
  IS running in development and the gity account password is 123456789aA!
*/

describe("User", () => {

  let gityUserCookie: string;
  let invitation: string;

  it("should login gity", async (done) => {

    const client = createApolloClient();
    const userInput: UserLoginInput = {
      usernameOrEmail: "gity",
      password: "123456789aA!"
    };

    const res = await client.mutate({
      mutation: LoginUserDocument,
      variables: { userInput }
    });

    expect(res.data?.loginUser.error).toEqual(null);
    expect(res.context?.headers.get("set-cookie")).toBeDefined();

    gityUserCookie = res.context?.headers.get("set-cookie");
    gityUserCookie = gityUserCookie.substring(
      0,
      gityUserCookie.indexOf(';') + 1
    );

    done();
  })

  it("should generate a new invite only if input is valid", async (done) => {

    const client = createApolloClient();
    const { data } = await client.mutate({
      context: { cookie: gityUserCookie },
      mutation: GenerateInvitationDocument,
      variables: { password: "123456789aA!" }
    });

    expect(data?.generateInvitation).not.toBeNull();
    invitation = data?.generateInvitation as string;

    done();
  });

  it("should logout gity user", async (done) => {

    const client = createApolloClient();
    const { data } = await client.mutate({
      context: { cookie: gityUserCookie },
      mutation: LogoutUserDocument,
    });

    expect(data?.logoutUser).toBe(true);

    gityUserCookie = "";

    done();
  })

  const validUsername = "tes";
  const validEmail = "tes@tes.com";
  const validPass = "123456789aA!";

  it("should not register if input is invalid", async (done) => {
    const client = createApolloClient();

    const badUserInput: UserRegisterInput = {
      username: "te" /* too short */,
      email: validEmail /* good for now */,
      password: validPass /* good for now */,
      invitation: "" /* also bad but this is checked last */
    };

    const runCreateUserMutation = async () => {
      return await client.mutate({
        mutation: CreateUserDocument,
        variables: { userInput: badUserInput }
      });
    }

    /* ---- username tests ---- */
    let res = await runCreateUserMutation();
    expect(res.data?.createUser.error?.field).toEqual("username");

    badUserInput.username = "aaa$$$" /* invalid chars */;
    res = await runCreateUserMutation();
    expect(res.data?.createUser.error?.field).toEqual("username");

    badUserInput.username = 
      "123456789012345678901234567890123456" /* too long */;
    res = await runCreateUserMutation();
    expect(res.data?.createUser.error?.field).toEqual("username");

    badUserInput.username = validUsername /* this is valid */ ;

    /* ---- email tests ---- */
    badUserInput.email = "gostupidyegobonkers";
    res = await runCreateUserMutation();
    expect(res.data?.createUser.error?.field).toEqual("email");

    badUserInput.email = validEmail;
    for(let i = 0; i <= 101; ++i) badUserInput.email += "a"; /* this is too long */
    res = await runCreateUserMutation();
    expect(res.data?.createUser.error?.field).toEqual("email");

    badUserInput.email = validEmail; /* this is valid */

    /* ---- password tests ---- */
    badUserInput.password = "1234aA!"; /* too short */
    res = await runCreateUserMutation();
    expect(res.data?.createUser.error?.field).toEqual("password");

    badUserInput.password = "123456789"; /* doesn't contain letters or symbols */
    res = await runCreateUserMutation();
    expect(res.data?.createUser.error?.field).toEqual("password");

    badUserInput.password = "123456789a"; /* doesn't contain symbols */
    res = await runCreateUserMutation();
    expect(res.data?.createUser.error?.field).toEqual("password");

    badUserInput.password = "123456789!"; /* doesn't contain letters */
    res = await runCreateUserMutation();
    expect(res.data?.createUser.error?.field).toEqual("password");

    badUserInput.password = "aaaaaaa!"; /* doesn't contain numbers */
    res = await runCreateUserMutation();
    expect(res.data?.createUser.error?.field).toEqual("password");

    badUserInput.password = validPass; /* this is valid */

    /* ---- invitation tests ---- */
    res = await runCreateUserMutation();
    expect(res.data?.createUser.error?.field).toEqual("invitation");

    done();
  });

  it("should register if input is valid", async (done) => {
    const client = createApolloClient();
    const validUserInput: UserRegisterInput = {
      username: validUsername,
      email: validEmail,
      password: validPass,
      invitation
    };

    const { data } = await client.mutate({
      mutation: CreateUserDocument,
      variables: { userInput: validUserInput }
    });
    invitation = "";

    expect(data?.createUser.error).toBeNull();
    expect(data?.createUser.user?.username).toEqual(validUsername);

    done();
  })

  it("should not login user if input is invalid", async (done) => {

    const client = createApolloClient();
    const invalidUserInput: UserLoginInput = {
      usernameOrEmail: "thisuserdoesntexist",
      password: validPass
    };

    let res = await client.mutate({
      mutation: LoginUserDocument,
      variables: { userInput: invalidUserInput }
    });

    expect(res.data?.loginUser.error?.field).toEqual("usernameOrEmail");
    expect(res.context?.headers.get("set-cookie")).toBeUndefined();

    invalidUserInput.usernameOrEmail = "thisemail@doesntexist.com";

    res = await client.mutate({
      mutation: LoginUserDocument,
      variables: { userInput: invalidUserInput }
    });

    expect(res.data?.loginUser.error?.field).toEqual("usernameOrEmail");
    expect(res.context?.headers.get("set-cookie")).toBeUndefined();

    invalidUserInput.usernameOrEmail = validUsername;
    invalidUserInput.password = "thisisnttherightpass";

    res = await client.mutate({
      mutation: LoginUserDocument,
      variables: { userInput: invalidUserInput }
    });

    expect(res.data?.loginUser.error?.field).toEqual("password");
    expect(res.context?.headers.get("set-cookie")).toBeUndefined();

    done();
  })

  let userCookie: string;

  it("should login user if input is valid", async (done) => {
    const client = createApolloClient();
    const userInput: UserLoginInput = {
      usernameOrEmail: validUsername,
      password: validPass
    };

    let res = await client.mutate({
      mutation: LoginUserDocument,
      variables: { userInput }
    });

    expect(res.data?.loginUser.error).toBeNull();
    expect(res.data?.loginUser.user?.username).toBe(validUsername);
    expect(res.context?.headers.get("set-cookie")).toBeDefined();

    userInput.usernameOrEmail = validEmail;

    res = await client.mutate({
      mutation: LoginUserDocument,
      variables: { userInput }
    });

    expect(res.data?.loginUser.error).toBeNull();
    expect(res.data?.loginUser.user?.username).toBe(validUsername);
    expect(res.context?.headers.get("set-cookie")).toBeDefined();

    userCookie = res.context?.headers.get("set-cookie");

    done();
  })

  it("should get self with cookie", async (done) => {
    const client = createApolloClient();
    let { data } = await client.query({
      context: { cookie: userCookie },
      query: GetSelfUserDocument,
    });

    expect(data.getSelfUser?.username).toEqual(validUsername);

    done();
  })

  it("should be able to query 'gity' user", async (done) => {
    const client = createApolloClient();
    let { data } = await client.query({
      context: { cookie: userCookie },
      query: GetUserDocument,
      variables: { username: "gity" }
    });

    expect(data.getUser?.username).toEqual("gity");

    done();
  })

  it("should not log out user if no or wrong cookie is provided", async (done) => {

    const client = createApolloClient();
    let res = await client.mutate({
      mutation: LogoutUserDocument,
    });

    expect(res.data?.logoutUser).toBe(null);

    res = await client.mutate({
      context: { cookie: "user-session=\"somerandomshit\"" },
      mutation: LogoutUserDocument,
    });

    expect(res.data?.logoutUser).toBe(null);

    done();
  })

  it("should log out user if valid cookie is provided", async (done) => {

    const client = createApolloClient();
    const { data } = await client.mutate({
      context: { cookie: userCookie },
      mutation: LogoutUserDocument,
    });

    expect(data?.logoutUser).toEqual(true);

    /* login again */
    const userInput: UserLoginInput = {
      usernameOrEmail: validUsername,
      password: validPass
    };

    let res = await client.mutate({
      mutation: LoginUserDocument,
      variables: { userInput }
    });

    expect(res.data?.loginUser.error).toBeNull();
    expect(res.data?.loginUser.user?.username).toBe(validUsername);
    expect(res.context?.headers.get("set-cookie")).toBeDefined();

    userCookie = res.context?.headers.get("set-cookie");

    done();
  })

  it("should not delete user if input is invalid", async (done) => {

    const client = createApolloClient();
    /* no cookie */
    let res = await client.mutate({
      mutation: DeleteUserDocument,
      variables: { password: validPass }
    });

    expect(res.data?.deleteUser).toEqual(null);

    /* cookie but wrong password */
    res = await client.mutate({
      context: { cookie: userCookie },
      mutation: DeleteUserDocument,
      variables: { password: "invalidPassword123!" }
    });

    expect(res.data?.deleteUser).toEqual(null);

    done();
  })

  it("should delete user if input is valid", async (done) => {
    const client = createApolloClient();
    const res = await client.mutate({
      mutation: DeleteUserDocument,
      context: { cookie: userCookie },
      variables: { password: validPass }
    });

    expect(res.data?.deleteUser).toEqual(true);

    done();
  })

});
