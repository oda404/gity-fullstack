
import { ApolloQueryResult } from "@apollo/client";
import { Box, Flex, Link, Image } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { GetServerSideProps } from "next";
import Head from "next/head";
import React from "react";
import Container from "../components/Container";
import FormSubmitButton from "../components/FormSubmitButton";
import InputField from "../components/InputField";
import { GetSelfUserDocument, GetSelfUserQuery } from "../generated/graphql";
import createApolloSSRClient from "../utils/apollo-gsspClient.ts";
import { redirectTo } from "../utils/responses";
import { webHost } from "../utils/webHost";

interface LoginProps
{
  
};

export default function Login(props: LoginProps)
{
  return (
    <Container>
      <Head>
        <title>Sign in | Gity</title>
      </Head>
      <Flex
        fontSize="32px"
        mx="auto"
        mb="5px"
        mt="40px"
      >
        Sign in to Gity
      </Flex>
      <Image mx="auto" boxSize="84px" mb="30px" src="./images/logo.svg"/>
      <Flex
        paddingX="20px"
        bgColor="#1a1a1a"
        paddingY="17px"
        border="2px solid inherit"
        borderRadius="10px"
        boxShadow="rgba(0, 0, 0, 0.35) 0px 5px 15px"
        mx="auto"
        w="400px"
      >
        <Formik
          initialValues={{
            usernameOrEmail: "",
            password: ""
          }}
          onSubmit={ async (values, { setErrors }) => {
            const res = await (await fetch(`${webHost}/api/session`, {
              method: "POST",
              body: JSON.stringify(values)
            })).json();

            if(res.error === null)
            {
              window.location.replace('/');
            }
            else
            {
              let error: Record<string, string> = {};
              error[res.error.field] = res.error.message;
              setErrors(error);
            }
          }}
          >
          {({ isSubmitting }) => (
            <Form style={{width: "100%"}}>
              <InputField 
                fieldProps={{
                  name: "usernameOrEmail", 
                  label: "Username or Email"
                }}
              />
              <Box mt={5}>
                <InputField
                  fieldProps={{
                    name: "password", 
                    label: "Password", 
                    type: "password"
                  }}
                />
              </Box>
              <FormSubmitButton isSubmitting={isSubmitting} label="Sign in"/>
            </Form>
          )}
        </Formik>
      </Flex>
      <Box mx="auto" mt="13px" color="#b1a4a4" fontSize="16px">
        New on Gity? <Link 
                        href="/register" 
                        color="#12a0d3" 
                        variant="link"
                        _focus={{boxShadow: "none"}}
                      >
                        Create an account
                      </Link>.
      </Box>
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {

  const client = createApolloSSRClient();

  try
  {
    const { data: { getSelfUser } }: ApolloQueryResult<GetSelfUserQuery> = 
      await client.query({ 
        query: GetSelfUserDocument,
        context: { cookie: req.headers.cookie }
      });

    if(getSelfUser)
    {
      redirectTo('/', res);
    }
  } catch(_) {
    redirectTo('/', res);
  }

  return {
    props: {

    }
  }
}
