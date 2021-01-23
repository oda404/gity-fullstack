import { ApolloQueryResult } from "@apollo/client";
import { Box, Flex } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import React, { useState } from "react";
import Container from "../../components/Container";
import FormSubmitButton from "../../components/FormSubmitButton";
import Header from "../../components/Header";
import InputField from "../../components/InputField";
import { GetUserDocument, GetUserQuery, GetSelfUserDocument, GetSelfUserQuery } from "../../generated/graphql";
import createApolloSSRClient from "../../utils/apollo-gsspClient.ts";
import parseCookiesFromIncomingMessage from "../../utils/parseCookies";
import { useGenerateInvitationMutation } from "../../generated/graphql";

interface UserIndexProps
{
  ssr: InferGetServerSidePropsType<typeof getServerSideProps> 
    & GetUserQuery & { sessionUsername: string | null } & { isLoggedIn: boolean } | null;
}

export default function UserIndex(props: UserIndexProps)
{
  const [ invitation, setInvitation ] = useState<string | null>(null);
  const [ runGenerateInvitationMutation ] = useGenerateInvitationMutation();
  let body = null;

  if(props.ssr.isLoggedIn)
  {
    body = (
      <Flex
        paddingX="20px"
        bgColor="#1a1a1a"
        paddingY="17px"
        mt="200px"
        border="2px solid inherit"
        borderRadius="10px"
        boxShadow="rgba(0, 0, 0, 0.35) 0px 5px 15px"
        mx="auto"
        w="400px"
      >
        <Formik
          initialValues={{
            password: ""
          }}
          onSubmit={ async ({ password }, { setErrors }) => {
            const { data: { generateInvitation: inv } } = await runGenerateInvitationMutation({
              variables: {
                password
              }
            });

            if(inv === null)
            {
              setErrors({ password: "Invalid password" });
            }
            else
            {
              setInvitation(inv);
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form style={{width: "100%"}}>
              <Box>
                <InputField
                  fieldProps={{
                    name: "password", 
                    label: "Password", 
                    type: "password"
                  }}
                />
              </Box>
              <FormSubmitButton isSubmitting={isSubmitting} label="Generate invitation"/>
              <Box>{invitation}</Box>
            </Form>
          )}
        </Formik>
      </Flex>
    );
  }

  return (
    <Container>
      <Head>
        <title>{`${props.ssr.getUser.username} | Gity`}</title>
      </Head>
      <Header squish type="full" username={props.ssr.sessionUsername} />
      {body}
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  
  const cookies = parseCookiesFromIncomingMessage(ctx.req);
  const client = createApolloSSRClient(cookies);
  const strippedUsername = ctx.req.url.substring(1);
  const redirectTo404 = () => {
    ctx.res.writeHead(302, {
      Location: "/404"
    });
    ctx.res.end();
  }

  let isLoggedIn = false;
  let sessionUsername = null;
  let getUserData: GetUserQuery;

  try
  {
    const { data }: ApolloQueryResult<GetUserQuery> = 
    await client.query({ query: GetUserDocument, variables: {
      username: strippedUsername
    } });

    getUserData = data;

    if(!data.getUser)
    {
      redirectTo404();
      return { props: { ssr: null } };
    }

    try
    {
      const { data: selfData }: ApolloQueryResult<GetSelfUserQuery> = 
      await client.query({ query: GetSelfUserDocument});

      if(selfData.getSelfUser)
      {
        sessionUsername = selfData.getSelfUser.username;
        if(selfData.getSelfUser.username === strippedUsername)
        {
          isLoggedIn = true;
        }
      }
    } catch(_) { }

  } catch(_) {
    redirectTo404();
    return { props: { ssr: null } };
  }

  return {
    props: {
      ssr:{
        getUser: getUserData.getUser,
        isLoggedIn,
        sessionUsername
      }
    }
  }
}
