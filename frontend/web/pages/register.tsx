import { ApolloQueryResult } from "@apollo/client";
import { Box, Flex, Link } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { GetServerSideProps } from "next";
import Head from "next/head";
import React from "react";
import Container from "../components/Container";
import FormSubmitButton from "../components/FormSubmitButton";
import Header from "../components/Header";
import InputField from "../components/InputField";
import { GetSelfUserQuery, GetSelfUserDocument } from "../generated/graphql";
import createApolloSSRClient from "../utils/apollo-gsspClient.ts";
import { redirectTo } from "../utils/responses";
import { webHost } from "../utils/webHost";

interface RegisterProps
{
  
}

export default function Register(props: RegisterProps)
{
  return (
    <Container>
      <Head>
        <title>Sign up | Gity</title>
      </Head>
      <Header type="showLogin" squish/>
      <Flex
        fontSize="40px"
        mx="auto"
        my="28px"
        textAlign="center"
      >
        Create an account on Gity
      </Flex>
      <Flex
        paddingX="20px"
        bgColor="#1a1a1a"
        paddingY="17px"
        border="2px solid inherit"
        borderRadius="10px"
        boxShadow="rgba(0, 0, 0, 0.35) 0px 5px 15px"
        mx="auto"
        w="400px"
        flexDir="column"
      >
        <Formik
          initialValues={{
            username: "",
            email: "",
            password: "",
            invitation: ""
          }}
          onSubmit={ async (values, { setErrors }) => {
            const res = await (await fetch(`${webHost}/api/register`, {
              method: "POST",
              body: JSON.stringify(values)
            })).json();

            if(res.error)
            {
              let error: Record<string, string> = {};
              error[res.error.field] = res.error.message;
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
                  name: "username", 
                  label: "Username"
                }}
                infoBubble={{info: [
                  "Length: 3-35 characters.",
                  "Valid characters: a-z A-Z 0-9 - _"
                ]}} 
              />
              <Box mt={5}>
                <InputField 
                  fieldProps={{
                    name: "email", 
                    label: "Email"
                  }}
                />
              </Box>
              <Box mt={5}>
                <InputField 
                  fieldProps={{
                    name: "password", 
                    label: "Password", 
                    type: "password"
                  }} 
                  infoBubble={{info: [
                    "Minimum length: 8 characters.",
                    "1 lowercase letter.",
                    "1 uppercase letter.",
                    "1 symbol.",
                    "1 number."
                  ]}} 
                />
              </Box>
              <Box mt={5}>
                <InputField 
                  fieldProps={{
                    name: "invitation", 
                    label: "Invitation"
                  }}
                />
              </Box>
              <FormSubmitButton isSubmitting={isSubmitting} label="Sign up"/>
            </Form>
          )}
        </Formik>
        <Box mt="13px" color="#b1a4a4" fontSize="12px">
          By creating an account on Gity, you agree to our <Link _focus={{boxShadow: "none"}} href="/tos" color="#12a0d3" variant="link">Terms of service</Link>
          .
        </Box>
      </Flex>
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
