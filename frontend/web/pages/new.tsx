import { ApolloQueryResult } from "@apollo/client";
import { LockIcon, QuestionOutlineIcon, UnlockIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, FormControl, Input, Link, Radio, RadioGroup, Stack } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import React from "react";
import Container from "../components/Container";
import Divider from "../components/Divider";
import Header from "../components/Header";
import { SelfQuery, SelfDocument, useCreateRepoMutation } from "../generated/graphql";
import createApolloSSRClient from "../utils/apollo-gsspClient.ts";
import parseCookiesFromIncomingMessage from "../utils/parseCookies";

interface NewProps
{
  ssr: InferGetServerSidePropsType<typeof getServerSideProps> & SelfQuery | null;
}

export default function New(props: NewProps)
{
  const [ runCreateRepoMutation ] = useCreateRepoMutation();
  return (
    <Container>
      <Head>
        <title>New repository | Gity</title>
      </Head>
      <Flex mx="auto" flexDir="column">
        <Header squish type="full" username={props.ssr?.self?.username} />
        <Box
          fontSize="30px"
          mt="40px"
          color="#d8dbcb"
        >
          Create a new repository
        </Box>
        <Box
          color="#b2a2a2"
          mb="15px"
          fontSize="15px"
        >
          Already have a git project on another VCS host? <Link color="#12a0d3" variant="link">Import it.</Link>
        </Box>
        <Divider mb="20px" />
        <Formik
          initialValues={{
            name: "",
            isPrivate: false
          }}
          onSubmit={ async (values) => {
            const res = await runCreateRepoMutation({ variables: {
              name: values.name,
              isPrivate: values.isPrivate
            } });
            window.location.replace('/');
          }}
        >
          {({ values, handleChange, isSubmitting }) => (
            <Form>
              <Flex direction="column">
                <Stack spacing="0px" direction="row">
                  <Stack spacing="0px">
                    <Box fontSize="16px" color="#d8dbcb">
                      Owner
                    </Box>
                    <Flex
                      bg="#212121"
                      padding="10px"
                      h="32px"
                      alignItems="center"
                      border="1px solid #4c4c4c"
                      borderRadius="5px"
                      color="#cdbcbc"
                      fontSize="17px"
                    >
                      {props.ssr?.self?.username}
                    </Flex>
                  </Stack>
                  <Stack>
                    <Box boxSize="17px"/>
                    <Flex
                      padding="10px"
                      h="32px"
                      alignItems="center"
                      fontSize="20px"
                      color="#cdbcbc"
                    >
                      /
                    </Flex>
                  </Stack>
                  <Stack mb="20px" spacing="0px">
                    <FormControl>
                      <Box fontSize="16px" color="#d8dbcb">
                        Name
                      </Box>
                      <Flex>
                        <Input
                          value={values.name}
                          onChange={handleChange}
                          id="name"
                          h="32px"
                          padding="10px"
                          bg="#212121"
                          w="200px"
                          borderColor="#4c4c4c"
                          _hover={{border:"1px solid #4c4c4c", borderRadius:"5px"}}
                          _focus={{border:"1px solid #4c4c4c", borderRadius:"5px"}}
                          color="#cdbcbc"
                          fontSize="17px"
                        />
                        <QuestionOutlineIcon my="auto" ml="15px" />
                      </Flex>
                    </FormControl>
                  </Stack>
                </Stack>
                <Divider mb="20px" />
                <FormControl mb="20px">
                  <RadioGroup defaultValue="public">
                    <Stack spacing="16px" direction="column">
                      <Radio
                        value="public"
                        onChange={() => values.isPrivate = false}
                        _focus={{boxShadow: "none"}}
                      >
                        <Flex>
                          <UnlockIcon my="auto" boxSize="32px" color="yellow.400" />
                          <Box ml="10px">
                            <Box fontSize="16px" color="#d8dbcb">
                              <b>Public</b>
                            </Box>
                            <Box m="0" overflow="hidden" color="#c2c4b7" fontSize="14px">
                              Any person can view/clone the repository, but only the owner can modify it.
                            </Box>
                          </Box>
                        </Flex>
                      </Radio>
                      <Radio
                        value="private"
                        onChange={() => values.isPrivate = true}
                        _focus={{boxShadow: "none"}}
                      >
                        <Flex>
                          <LockIcon my="auto" boxSize="32px" color="red.400" />
                          <Box ml="10px">
                            <Box fontSize="16px" color="#d8dbcb">
                              <b>Private</b>
                            </Box>
                            <Box m="0" overflow="hidden" color="#c2c4b7" fontSize="14px">
                              Only the owner will know about the repository's existence.
                            </Box>
                          </Box>
                        </Flex>
                      </Radio>
                    </Stack>
                  </RadioGroup>
                </FormControl>
                <Divider mb="20px" />
                <Button
                  w="110px"
                  h="35px"
                  bg="#5c0098"
                  color="#e9e9e9"
                  fontSize="18px"
                  type="submit"
                  _hover={{bg: "#530089"}}
                  _active={{bg: "#6e00b4"}}
                  _focus={{boxShadow: "none"}}
                  isLoading={isSubmitting}
                >
                  Create
                </Button>
              </Flex>
            </Form>
          )}
        </Formik>
      </Flex>
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {

  const cookies = parseCookiesFromIncomingMessage(ctx.req);
  const client = createApolloSSRClient(cookies);

  try
  {
    const { data }: ApolloQueryResult<SelfQuery> = 
    await client.query({ query: SelfDocument });
    
    if(!data.self)
    {
      ctx.res.writeHead(302, {
        Location: '/login'
      });
      ctx.res.end();
    }

    return {
      props: {
          ssr: {
          self: data.self,
        }
      }
    }
  } catch (_) {
      return {
        props: {
          ssr: null,
        }
      }
  }
}
  
