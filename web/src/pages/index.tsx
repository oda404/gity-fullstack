import { Box, Button, Flex } from "@chakra-ui/core";
import { useRouter } from "next/router";
import { FC } from "react";
import Container from "../components/Container";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useSelfQuery } from "../generated/graphql";

interface IndexProps
{

};

const Index: FC<IndexProps> = () =>
{
  const [{data, fetching}] = useSelfQuery();
  const router = useRouter();

  let body = null;

  if(!fetching)
  {
    if(data?.self)
    {
      body = (
        <>
          <Flex
            h="100%" w="300px" bg="#161616" flexDir="column"
          >
            <Flex>
              <Box my="10px" ml="10px" fontSize="19px" color="#e9e9e9">
                Repos
              </Box>
              <Button
                color="#e9e9e9"
                my="10px" ml="auto"
                mr="10px"
                h="29px"
                w="70px"
                display="flex"
                alignItems="center"
                padding="10px"
                fontSize="15px"
                bg="#212121"
                border="1px solid #4c4c4c"
                borderRadius="5px"
                flexDir="column"
              >
                <a href="/new">New</a>
              </Button>
            </Flex>
            <Box
              w="100%"
              h="1px"
              bg="#312e2e"
            />
          </Flex>
          <Box
            h="100%"
            w="1px"
            bg="#312e2e"
          >
          </Box>
        </>
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
      <Footer/>
    </Container>
  );
};

export default Index
