import { Box, Button, Flex, Link } from "@chakra-ui/core";
import { useRouter } from "next/router";
import { FC } from "react";
import Container from "../components/Container";
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
    if(reposQuery.data?.getUserRepos && reposQuery.data.getUserRepos.length > 0)
    {
      repos = (
        reposQuery.data.getUserRepos.map(repo =>
          <Flex 
            key={repo.id}
            mt="10px"
            paddingX="10px"
          >
            <Link
              mr="10px"
              wordBreak="break-all"
              href={data?.self?.username + '/' + repo.name}
              color="#12a0d3"
              fontSize="18px"
            >
              {data?.self?.username}/{repo.name}
            </Link>
            <Box ml="auto" fontSize="18px">
              {repo.likes}
            </Box>
          </Flex>
        )
      );
    }
    else
    {
      repos = (
        <Box
          my="auto"
          fontSize="18px"
          textAlign="center"
          color="#cdbcbc"
        >
          You don't have any repos yet... Create one by clicking the "New" button.
        </Box>
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
            padding="12px" h="100%" w="300px" bg="#000501" flexDir="column"
          >
            <Flex>
              <Box fontSize="18px" color="#e9e9e9">
                Repos
              </Box>
              <Button
                color="#e9e9e9"
                ml="auto"
                h="28px"
                w="68px"
                display="flex"
                alignItems="center"
                padding="10px"
                fontSize="15px"
                bg="#5c0098"
                border="1px solid #5A0B4D"
                _hover={{background: "#56038c"}}
                _active={{background: "#56038c"}}
                borderRadius="5px"
                flexDir="column"
                onClick={() => router.push("/new")}
              >
                New
              </Button>
            </Flex>
            <Box
              mt="10px"
              w="100%"
              h="1px"
              bg="#5A0B4D"
            />
            {repos}
          </Flex>
          <Box
            h="100%"
            w="1px"
            bg="#5A0B4D"
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
    </Container>
  );
};

export default Index
