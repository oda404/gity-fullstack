import { Box, Button, Flex, FormControl, Input, Link, Radio, RadioGroup, Stack } from "@chakra-ui/core";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import React, { FC } from "react";
import Container from "../components/Container";
import Header from "../components/Header";
import { useCreateRepoMutation, useSelfQuery } from "../generated/graphql";

interface NewProps
{

};

const New: FC<NewProps> = () =>
{
  const [{data, fetching}] = useSelfQuery();
  const [, createRepo] = useCreateRepoMutation();
  const router = useRouter();

  let body = null;

  if(!fetching)
  {
    if(data?.self)
    {
      body = (
        <Flex
          borderRadius="10px"
          alignSelf="center"
          boxShadow="rgba(0, 0, 0, 0.35) 0px 5px 15px"
          mx="auto"
          flexDir="column"
        >
          <Box
            fontSize="24px"
            mx="auto"
            color="#cdbcbc"
          >
            Create a new repo
          </Box>
          <Box
            mx="auto"
            color="#b2a2a2"
          >
            If you already have a git repository on another VCS host you can <Link color="#12a0d3" variant="link">import it.</Link>
          </Box>
          <Box w="100%" h="1px" my="10px" bg="#312e2e"/>
          <Formik
            initialValues={{
              name: "",
              isPrivate: false
            }}
            onSubmit={ async (values) => {
              const response = await createRepo(values);
              if(response.data?.createRepo?.error)
              {
                console.log(response.data.createRepo.error);
              }
              else
              {
                router.push('/');
              }
            }}
          >
            {({ values, handleChange, isSubmitting }) => (
              <Form>
                <Flex direction="column">
                  <Stack spacing="0px" direction="row" mx="auto">
                    <Flex
                      bg="#212121"
                      padding="10px"
                      h="32px"
                      alignItems="center"
                      border="1px solid #4c4c4c"
                      borderRadius="5px"
                      color="#cdbcbc"
                    >
                      {data.self?.username}
                    </Flex>
                    <Flex
                      padding="10px"
                      h="32px"
                      alignItems="center"
                      fontSize="20px"
                      color="#cdbcbc"
                    >
                      /
                    </Flex>
                    <FormControl>
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
                    </FormControl>
                  </Stack>
                  <FormControl>
                    <RadioGroup defaultValue="public">
                      <Stack direction="column">
                        <Radio
                          value="public"
                          onChange={() => values.isPrivate = false}
                        >
                          Public
                        </Radio>
                        <Radio
                          value="private"
                          onChange={() => values.isPrivate = true}
                        >
                          Private
                        </Radio>
                      </Stack>
                    </RadioGroup>
                  </FormControl>
                  <Button
                    mx="auto"
                    bg="#5c0098"
                    color="#e9e9e9"
                    fontSize="18px"
                    type="submit"
                    _hover={{bg: "#530089"}}
                    _active={{bg: "#6e00b4"}}
                    isLoading={isSubmitting}
                  >
                    Create
                  </Button>
                </Flex>
              </Form>
            )}
          </Formik>
        </Flex>
      );
    }
    else
    {
      router.replace("/register");
    }
  }

  return (
    <Container>
      <Header type="full"/>
      {body}
    </Container>
  );
}

export default New;
