
import { ApolloQueryResult } from "@apollo/client";
import { Box, Flex, Link, Image } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import React from "react";
import Container from "../components/Container";
import FormSubmitButton from "../components/FormSubmitButton";
import InputField from "../components/InputField";
import { SelfDocument, SelfQuery, useLoginUserMutation } from "../generated/graphql";
import createApolloSSRClient from "../utils/apollo-gsspClient.ts";
import parseCookiesFromIncomingMessage from "../utils/parseCookies";

interface LoginProps
{
  
};

export default function Login(props: LoginProps)
{
  const [ runLoginUserMutation ] = useLoginUserMutation();

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
            const { data: { loginUser } } = await runLoginUserMutation({
              variables: {
                userInput: values
              }
            });

            if(loginUser.error)
            {
              let error: Record<string, string> = {};
              error[loginUser.error.field] = loginUser.error.message;
              setErrors(error);
            }
            else
            {
              window.location.replace('/');
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

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const cookies = parseCookiesFromIncomingMessage(ctx.req);
  if(cookies.size === 0)
  {
    return {
      props: {

      }
    }
  }

  const client = createApolloSSRClient(cookies);

  const redirectToIndex = () => {
    ctx.res.writeHead(302, {
      Location: '/'
    });
    ctx.res.end();
  }

  try
  {
    const { data }: ApolloQueryResult<SelfQuery> = 
      await client.query({ query: SelfDocument });

    if(data.self)
    {
      redirectToIndex();
    }
  } catch(_) {
    redirectToIndex();
  }

  return {
    props: {

    }
  }
}
