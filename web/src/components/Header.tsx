import { FC } from "react";
import { Flex, Box, Button } from "@chakra-ui/core";
import { useLogoutUserMutation, useSelfQuery } from "../generated/graphql";
import LinkButton from "./LinkButton";

interface HeaderProps
{
  content: "login"|"register"|"full"
};

const Header: FC<HeaderProps> = (props) => {
  const [{ data, fetching }] = useSelfQuery();
  const [, logoutUser] = useLogoutUserMutation()
  let body = null;

  if(!fetching)
  {
    if(data?.self)
    {
      body = (
        <>
          <LinkButton hasBox={false} link="/">
            {data.self.username}
          </LinkButton>
          <Button
            color="#e9e9e9"
            bg="#212121"
            border="1px solid #4c4c4c"
            borderRadius="5px"
            h="34px"
            display="flex"
            alignItems="center"
            padding="10px"
            fontSize="17px"
            _hover={{ bg: "#191919", color: "#d2d2d2" }}
            _active={{ bg: "#1a1a1a" }}
            onClick={ async () => {
              await logoutUser();
              window.location.reload();
            }}
          >
            Log out
          </Button>
        </>
      );
    }
    else
    {
      if(props.content == "full")
      {
        body = (
          <>
            <LinkButton hasBox link="/login">
              Login
            </LinkButton>
            <Box mr="10px"/>
            <LinkButton hasBox link="/register">
              Sign up
            </LinkButton>
          </>
        );
      }
      else
      {
        body = (
          <LinkButton hasBox link={`/${props.content}`}>
            {props.content === "login" ? "Login" : "Sign up"}
          </LinkButton>
        );
      }
    }
  }

  return (
    <>
      <Flex
        w="100%"
        h="55px"
        bg="#1a1a1a"
        pos="fixed"
        top="0"
        left="0"
        padding="18px"
        alignItems="center"
        fontSize="32px"
        fontFamily="Kanit"
        zIndex="999"
      >
        <Box mr="auto">Gity</Box>
        {body}
      </Flex>
      <Box
        pos="fixed"
        top="55px"
        left="0"
        w="100%"
        h="1px"
        bg="#312e2e"
      />
    </>
  );
};

export default Header;
