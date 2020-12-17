import { Box, Button, Flex, Link } from "@chakra-ui/core";
import { useRouter } from "next/router";
import { FC } from "react";
import Container from "../components/Container";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useGetUserReposQuery, useSelfQuery } from "../generated/graphql";

interface IndexProps
{

};

const Index: FC<IndexProps> = () =>
{
  const [{data, fetching}] = useSelfQuery();

  const [reposQuery] = useGetUserReposQuery({
    pause: fetching || data?.self === undefined,
    variables: { owner: data?.self?.username!, start: 0, count: 15  }
  });

  const router = useRouter();

  let body = null;
  let repos = null;

  if(!reposQuery.fetching)
  {
    if(reposQuery.data?.getUserRepos)
    {
      repos = (
        reposQuery.data.getUserRepos.map(repo =>
          <Flex 
            key={repo.id}
            bg="#212121"
            border="1px solid #312e2e"
            borderRadius="5px"
            mt="10px"
            mx="10px"
            paddingX="10px"
          >
            <Link mr="10px" wordBreak="break-all" href={data?.self?.username + '/' + repo.name} color="#12a0d3" fontSize="16px">
              {data?.self?.username}/{repo.name}
            </Link>
            <Box ml="auto">
              {repo.likes}
            </Box>
          </Flex>
        )
      );
    }
  }

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
                onClick={() => router.push("/new")}
              >
                New
              </Button>
            </Flex>
            <Box
              w="100%"
              h="1px"
              bg="#312e2e"
            />
            {repos}
          </Flex>
          <Box
            h="100%"
            w="1px"
            bg="#312e2e"
          />
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
