import request from "supertest";

const registerPostData = {
  query: `mutation registerUser($userInput: UserRegisterInput!){
    registerUser(userInput: $userInput)
    {
      error{
        field,
        message
      }
  
      user{
        username
        email
        isEmailVerified
        reposId
      }
    }
  }`,
  operationName: 'registerUser',
  variables: {
    userInput: {
      username: "test",
      email: "test@testmail.com",
      password: "123456789",
      invitation: "test"
    }
  }
};

const loginPostData = {
  query: `mutation loginUser($userInput: UserLoginInput!){
    loginUser(userInput: $userInput)
    {
      error{
        field,
        message
      }
  
      user{
        username
        email
        isEmailVerified
        reposId
      }
    }
  }`,
  operationName: 'loginUser',
  variables: {
    userInput: {
      usernameOrEmail: "test",
      password: "123456789"
    }
  }
};

const selfPostData = {
  query: `query self{
    self{
      username
      email
      isEmailVerified
      reposId
    }
  }`,
  operationName: 'self'
};

const changeUserEmailPostData = {
  query: `mutation changeUserEmail($newEmail: String!, $password: String!){
    changeUserEmail(newEmail: $newEmail, password: $password)
  }`,
  operationName: "changeUserEmail",
  variables: {
    newEmail: "newTest@testmail.com",
    password: "123456789"
  }
};

const changeUserPasswordPostData = {
  query: `mutation changeUserPassword($newPassword: String!, $password: String!){
    changeUserPassword(newPassword: $newPassword, password: $password)
  }`,
  operationName: "changeUserPassword",
  variables: {
    newPassword: "1234567890",
    password: "123456789"
  }
};

const deleteUserPostData = {
  query: `mutation deleteUser($password: String!){
    deleteUser(password: $password)
  }`,
  operationName: "deleteUser",
  variables: {
    password: "1234567890"
  }
};

describe("User", () => {
  it("regiserUser", async done => {
    /* register */
    request("localhost:4200").post("/graphql").send(registerPostData).end((err, res) => {
      expect(err).toEqual(null);
      expect(res.status).toEqual(200);
      const userRes = res.body.data.registerUser.user;
      expect(userRes.username).toEqual("test");
      expect(userRes.email).toEqual("test@testmail.com");
      expect(userRes.isEmailVerified).toEqual(false);
      expect(userRes.reposId).toEqual([]);
      done();
    });
  });

  it("loginUser", async done => {
    /* login */
    request("localhost:4200").post("/graphql").send(loginPostData).end((err, res) => {
      expect(err).toEqual(null);
      expect(res.status).toEqual(200);
      const userRes = res.body.data.loginUser.user;
      expect(userRes.username).toEqual("test");
      expect(userRes.email).toEqual("test@testmail.com");
      expect(userRes.isEmailVerified).toEqual(false);
      expect(userRes.reposId).toEqual([]);
      expect(res.headers["set-cookie"]).toBeDefined();
      expect(res.headers["set-cookie"].length).toBeGreaterThan(0);
      done();
    });
  });

  it("self", async done => {
    /* login */
    request("localhost:4200").post("/graphql").send(loginPostData).end((err, res) => {
      expect(err).toEqual(null);
      expect(res.status).toEqual(200);
      const userRes = res.body.data.loginUser.user;
      expect(userRes.username).toEqual("test");
      expect(userRes.email).toEqual("test@testmail.com");
      expect(userRes.isEmailVerified).toEqual(false);
      expect(userRes.reposId).toEqual([]);
      expect(res.headers["set-cookie"]).toBeDefined();
      expect(res.headers["set-cookie"].length).toBeGreaterThan(0);

      const cookie = res.headers["set-cookie"][0];

      /* self */
      request("localhost:4200").post("/graphql").set("Cookie", [cookie]).send(selfPostData).end((_err, _res) => {
        expect(_err).toEqual(null);
        expect(_res.status).toEqual(200);
        const userRes = _res.body.data.self;
        expect(userRes.username).toEqual("test");
        expect(userRes.email).toEqual("test@testmail.com");
        expect(userRes.isEmailVerified).toEqual(false);
        expect(userRes.reposId).toEqual([]);

        done();
      });
    });
  });

  it("changeUserEmail", async done => {
    /* login */
    request("localhost:4200").post("/graphql").send(loginPostData).end((err, res) => {
      expect(err).toEqual(null);
      expect(res.status).toEqual(200);
      const userRes = res.body.data.loginUser.user;
      expect(userRes.username).toEqual("test");
      expect(userRes.email).toEqual("test@testmail.com");
      expect(userRes.isEmailVerified).toEqual(false);
      expect(userRes.reposId).toEqual([]);
      expect(res.headers["set-cookie"]).toBeDefined();
      expect(res.headers["set-cookie"].length).toBeGreaterThan(0);

      const cookie = res.headers["set-cookie"][0];

      /* changeEmail */
      request("localhost:4200").post("/graphql").set("Cookie", [cookie]).send(changeUserEmailPostData).end((_err, _res) => {
        expect(_err).toEqual(null);
        expect(_res.status).toEqual(200);
        expect(_res.body.data.changeUserEmail).toEqual(true);
        
        /* self */
        request("localhost:4200").post("/graphql").set("Cookie", [cookie]).send(selfPostData).end((__err, __res) => {
          expect(__err).toEqual(null);
          expect(__res.status).toEqual(200);
          expect(__res.body.data.self.email).toEqual("newTest@testmail.com");

          done();
        });
      });
    });
  });

  it("changeUserPassword", async done => {
    /* login */
    request("localhost:4200").post("/graphql").send(loginPostData).end((err, res) => {
      expect(err).toEqual(null);
      expect(res.status).toEqual(200);
      const userRes = res.body.data.loginUser.user;
      expect(userRes.username).toEqual("test");
      expect(userRes.email).toEqual("newTest@testmail.com");
      expect(userRes.isEmailVerified).toEqual(false);
      expect(userRes.reposId).toEqual([]);
      expect(res.headers["set-cookie"]).toBeDefined();
      expect(res.headers["set-cookie"].length).toBeGreaterThan(0);

      const cookie = res.headers["set-cookie"][0];

      /* changePassword */
      request("localhost:4200").post("/graphql").set("Cookie", [cookie]).send(changeUserPasswordPostData).end((_err, _res) => {
        expect(_err).toEqual(null);
        expect(_res.status).toEqual(200);
        expect(_res.body.data.changeUserPassword).toEqual(true);
        
        let modLoginPostData = loginPostData;
        modLoginPostData.variables.userInput.password = "1234567890";
        /* login again */
        request("localhost:4200").post("/graphql").send(modLoginPostData).end((__err, __res) => {
          expect(__err).toEqual(null);
          expect(__res.status).toEqual(200);
          const _userRes = __res.body.data.loginUser.user;
          expect(_userRes.username).toEqual("test");
          expect(_userRes.email).toEqual("newTest@testmail.com");
          expect(_userRes.isEmailVerified).toEqual(false);
          expect(_userRes.reposId).toEqual([]);
          expect(__res.headers["set-cookie"]).toBeDefined();
          expect(__res.headers["set-cookie"].length).toBeGreaterThan(0);

          done();
        });
      });
    });
  });

  it("deleteUser", async done => {
    let modLoginPostData = loginPostData;
    modLoginPostData.variables.userInput.password = "1234567890";
    modLoginPostData.variables.userInput.usernameOrEmail = "newTest@testmail.com";

    /* login */
    request("localhost:4200").post("/graphql").send(modLoginPostData).end((err, res) => {
      expect(err).toEqual(null);
      expect(res.status).toEqual(200);
      const userRes = res.body.data.loginUser.user;
      expect(userRes.username).toEqual("test");
      expect(userRes.email).toEqual("newTest@testmail.com");
      expect(userRes.isEmailVerified).toEqual(false);
      expect(userRes.reposId).toEqual([]);
      expect(res.headers["set-cookie"]).toBeDefined();
      expect(res.headers["set-cookie"].length).toBeGreaterThan(0);

      const cookie = res.headers["set-cookie"][0];

      /* deleteUser */
      request("localhost:4200").post("/graphql").set("Cookie", [cookie]).send(deleteUserPostData).end((_err, _res) => {
        expect(_err).toEqual(null);
        expect(_res.status).toEqual(200);
        expect(_res.body.data.deleteUser).toEqual(true);
        done();
      });
    });
  });
});
