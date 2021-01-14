import { ApolloQueryResult } from "@apollo/client";
import { Box, Flex } from "@chakra-ui/react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import React, { useState } from "react";
import Container from "../../components/Container";
import Header from "../../components/Header";
import ProfileTabSelector from "../../components/ProfileTabSelector";
import { GetUserDocument, GetUserQuery, SelfDocument, SelfQuery } from "../../generated/graphql";
import createApolloSSRClient from "../../utils/apollo-gsspClient.ts";
import parseCookiesFromIncomingMessage from "../../utils/parseCookies";

interface UserIndexProps
{
  ssr: InferGetServerSidePropsType<typeof getServerSideProps> 
    & GetUserQuery & { sessionUsername: string | null } | null;
}

type Tabs = "profile" | "repos" | "invs" | "settings";

export default function UserIndex(props: UserIndexProps)
{
  const [selectedTab, selectTab] = useState<Tabs>("profile");
  const vDivider = <Box w="1px" h="100%" bg="#3b3737"/>;

  let body = null;

  switch(selectedTab)
  {
  case "invs":
    body = (
      <Flex>
        
      </Flex>
    ); 
    break;
  }

  return (
    <Container>
      <Head>
        <title>{`${props.ssr.getUser.username} | Gity`}</title>
      </Head>
      <Header squish type="full" username={props.ssr.sessionUsername} />
      <Flex h="100vh" flexDir="row" paddingX="420px" paddingY="50px">
        <Flex flexDir="column">
          <ProfileTabSelector
            selected={selectedTab === "profile"} 
            text="Profile"
            onClick={() => selectTab("profile")}
          />
          <ProfileTabSelector 
            selected={selectedTab === "repos"} 
            text="Repositories"
            onClick={() => selectTab("repos")}
          />
          {props.ssr.isLoggedIn ? 
            (
            <>
              <ProfileTabSelector 
                selected={selectedTab === "invs"} 
                onClick={() => selectTab("invs")}
                text="Invitations"
              /> 
              <ProfileTabSelector 
                selected={selectedTab === "settings"} 
                onClick={() => selectTab("settings")}
                text="Settings"
              />
            </>
            ) : null
          }
        </Flex>
        {vDivider}
        {body}
      </Flex>
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
      const { data: selfData }: ApolloQueryResult<SelfQuery> = 
      await client.query({ query: SelfDocument});

      if(selfData.self)
      {
        sessionUsername = selfData.self.username;
        if(selfData.self.username === strippedUsername)
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
