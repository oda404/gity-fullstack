import request from "supertest";

const apiEndpoint = "/api/private";
const host = "localhost:4200";

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
        isEmailVerified
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
        isEmailVerified
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
      isEmailVerified
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

const logoutUserPostData = {
  query: `mutation LogoutUser{
    logoutUser
  }`,
  operationName: "LogoutUser"
}

describe("User", () => {
  it("regiserUser", async done => {
    /* register */
    request(host).post(apiEndpoint).send(registerPostData).end((err, res) => {
      expect(err).toEqual(null);
      expect(res.status).toEqual(200);
      const userRes = res.body.data.registerUser.user;
      expect(userRes.username).toEqual("test");
      
      expect(userRes.isEmailVerified).toEqual(false);
      
      done();
    });
  });

  it("loginUser", async done => {
    /* login */
    request(host).post(apiEndpoint).send(loginPostData).end((err, res) => {
      expect(err).toEqual(null);
      expect(res.status).toEqual(200);
      const userRes = res.body.data.loginUser.user;
      expect(userRes.username).toEqual("test");
      
      expect(userRes.isEmailVerified).toEqual(false);
      
      expect(res.headers["set-cookie"]).toBeDefined();
      expect(res.headers["set-cookie"].length).toBeGreaterThan(0);
      done();
    });
  });

  it("self", async done => {
    /* login */
    request(host).post(apiEndpoint).send(loginPostData).end((err, res) => {
      expect(err).toEqual(null);
      expect(res.status).toEqual(200);
      const userRes = res.body.data.loginUser.user;
      expect(userRes.username).toEqual("test");
      
      expect(userRes.isEmailVerified).toEqual(false);
      
      expect(res.headers["set-cookie"]).toBeDefined();
      expect(res.headers["set-cookie"].length).toBeGreaterThan(0);

      const cookie = res.headers["set-cookie"][0];

      /* self */
      request(host).post(apiEndpoint).set("Cookie", [cookie]).send(selfPostData).end((_err, _res) => {
        expect(_err).toEqual(null);
        expect(_res.status).toEqual(200);
        const userRes = _res.body.data.self;
        expect(userRes.username).toEqual("test");
        
        expect(userRes.isEmailVerified).toEqual(false);
        

        done();
      });
    });
  });

  it("changeUserEmail", async done => {
    /* login */
    request(host).post(apiEndpoint).send(loginPostData).end((err, res) => {
      expect(err).toEqual(null);
      expect(res.status).toEqual(200);
      const userRes = res.body.data.loginUser.user;
      expect(userRes.username).toEqual("test");
      
      expect(userRes.isEmailVerified).toEqual(false);
      
      expect(res.headers["set-cookie"]).toBeDefined();
      expect(res.headers["set-cookie"].length).toBeGreaterThan(0);

      const cookie = res.headers["set-cookie"][0];

      /* changeEmail */
      request(host).post(apiEndpoint).set("Cookie", [cookie]).send(changeUserEmailPostData).end((_err, _res) => {
        expect(_err).toEqual(null);
        expect(_res.status).toEqual(200);
        expect(_res.body.data.changeUserEmail).toEqual(true);

        request(host).post(apiEndpoint).set("Cookie", [cookie]).send(logoutUserPostData).end((__err, __res) => {
          expect(__err).toEqual(null);
          expect(__res.status).toEqual(200);
          expect(__res.body.data.logoutUser).toEqual(true);

          const newLoginPostData = loginPostData;
          newLoginPostData.variables.userInput.usernameOrEmail = changeUserEmailPostData.variables.newEmail;

          request(host).post(apiEndpoint).send(newLoginPostData).end((___err, ___res) => {
            expect(___err).toEqual(null);
            expect(___res.status).toEqual(200);
            const userRes = ___res.body.data.loginUser.user;
            expect(userRes.username).toEqual("test");
            
            expect(userRes.isEmailVerified).toEqual(false);
            
            expect(___res.headers["set-cookie"]).toBeDefined();
            expect(___res.headers["set-cookie"].length).toBeGreaterThan(0);

            done();
          })
        })
      });
    });
  });

  it("changeUserPassword", async done => {
    /* login */
    request(host).post(apiEndpoint).send(loginPostData).end((err, res) => {
      expect(err).toEqual(null);
      expect(res.status).toEqual(200);
      const userRes = res.body.data.loginUser.user;
      expect(userRes.username).toEqual("test");
      
      expect(userRes.isEmailVerified).toEqual(false);
      
      expect(res.headers["set-cookie"]).toBeDefined();
      expect(res.headers["set-cookie"].length).toBeGreaterThan(0);

      const cookie = res.headers["set-cookie"][0];

      /* changePassword */
      request(host).post(apiEndpoint).set("Cookie", [cookie]).send(changeUserPasswordPostData).end((_err, _res) => {
        expect(_err).toEqual(null);
        expect(_res.status).toEqual(200);
        expect(_res.body.data.changeUserPassword).toEqual(true);
        
        let modLoginPostData = loginPostData;
        modLoginPostData.variables.userInput.password = "1234567890";
        /* login again */
        request(host).post(apiEndpoint).send(modLoginPostData).end((__err, __res) => {
          expect(__err).toEqual(null);
          expect(__res.status).toEqual(200);
          const _userRes = __res.body.data.loginUser.user;
          expect(_userRes.username).toEqual("test");
          expect(_userRes.isEmailVerified).toEqual(false);
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
    request(host).post(apiEndpoint).send(modLoginPostData).end((err, res) => {
      expect(err).toEqual(null);
      expect(res.status).toEqual(200);
      const userRes = res.body.data.loginUser.user;
      expect(userRes.username).toEqual("test");
      
      expect(userRes.isEmailVerified).toEqual(false);
      
      expect(res.headers["set-cookie"]).toBeDefined();
      expect(res.headers["set-cookie"].length).toBeGreaterThan(0);

      const cookie = res.headers["set-cookie"][0];

      /* deleteUser */
      request(host).post(apiEndpoint).set("Cookie", [cookie]).send(deleteUserPostData).end((_err, _res) => {
        expect(_err).toEqual(null);
        expect(_res.status).toEqual(200);
        expect(_res.body.data.deleteUser).toEqual(true);
        done();
      });
    });
  });
});
