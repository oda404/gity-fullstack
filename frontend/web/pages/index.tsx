import Container from "../components/Container";
import Header from "../components/Header";
import Head from "next/head";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import {  GetUserRepositoriesDocument, GetUserRepositoriesQuery, GetSelfUserDocument, GetSelfUserQuery } from "../generated/graphql";
import parseCookiesFromIncomingMessage from "../utils/parseCookies";
import createApolloSSRClient from "../utils/apollo-gsspClient.ts";
import { ApolloQueryResult } from "@apollo/client";
import React from "react";
import { Flex, Box, Link, Button } from "@chakra-ui/react";
import { LockIcon, UnlockIcon } from "@chakra-ui/icons";
import Divider from "../components/Divider";

interface IndexProps
{
  ssr: InferGetServerSidePropsType<typeof getServerSideProps> & GetSelfUserQuery & GetUserRepositoriesQuery | null
}

export default function Index(props: IndexProps)
{
  let body = null;

  if(props.ssr?.self)
  {
    let repos = null;

    if(props.ssr?.getUserRepos.length > 0)
    {
      repos = (
        props.ssr.getUserRepos.map(repo =>
          <Flex 
            key={repo.id}
            mt="5px"
            paddingX="10px"
          >
            {repo.isPrivate ? 
              <LockIcon boxSize="14px" my="auto" color="red.400"/> : 
              <UnlockIcon boxSize="14px" my="auto" color="yellow.400"/>
            }
            <Link
              mr="10px"
              ml="8px"
              wordBreak="break-all"
              href={props.ssr?.self?.username + '/' + repo.name}
              color="#12a0d3"
              fontSize="15px"
              _focus={{boxShadow: "none"}}
            >
              <b>{props.ssr?.self?.username}/{repo.name}</b>
            </Link>
          </Flex>
        )
      );
    }
    else
    {
      repos = (
        <Box
          mt="50px"
          mb="auto"
          fontSize="16px"
          textAlign="center"
          color="#cdbcbc"
        >
          You don't have any repos yet... Create one by clicking the "New" button.
        </Box>
      );
    }
    
    body = (
      <Flex
        h="100%"
        flexDir="row"
      >
        <Flex
          padding="20px" h="100%" w="315px" bg="#0e1214" flexDir="column"
        >
          <Flex>
            <Box mt="auto" fontSize="20px" color="#e9e9e9">
              <b>Repositories</b>
            </Box>
            <Link
              href="/new"
              bg="#5c0098"
              w="60px"
              h="30px"
              paddingTop="3px"
              fontSize="15px"
              borderRadius="8px"
              textAlign="center"
              color="#e9e9e9"
              ml="auto"
              my="auto"
              _hover={{textDecoration:"none", bg: "#510086"}}
              _focus={{boxShadow: "none"}}
            >
              New
            </Link>
          </Flex>
          <Divider mt="10px"/>
          {repos}
        </Flex>
        <Divider position="v" />
      </Flex>
    )
  }
  else
  {

  }

  return (
    <Container>
      <Head>
        <title>Gity</title>
      </Head>
      <Header type="full" username={props.ssr?.self?.username}/>
      {body}
    </Container>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {

  const cookies = parseCookiesFromIncomingMessage(ctx.req);
  const client = createApolloSSRClient(cookies);

  try
  {
    const { data }: ApolloQueryResult<GetSelfUserQuery> = 
      await client.query({ query: GetSelfUserDocument });
    
    let getUserReposResult: ApolloQueryResult<GetUserRepositoriesQuery>;   

    if(data.getSelfUser)
    {
      getUserReposResult = await client.query({ 
        query: GetUserRepositoriesDocument, 
        variables: {
          owner: data.getSelfUser.username,
          count: 15,
          start: 0
        }
      });
    }

    return {
      props: {
        ssr: {
          self: data.getSelfUser,
          getUserRepos: getUserReposResult.data.getUserRepositories
        }
      }
    }
  } catch (_) {
    return {
      props: {
        ssr: null,
        getUserRepos: null
      }
    }
  }
}
