import { FC } from "react";
import { Flex, Box } from "@chakra-ui/core";
import { useSelfQuery } from "../generated/graphql";
import LinkButton from "./LinkButton";

interface HeaderProps
{
  content: "login"|"register"
};

const Header: FC<HeaderProps> = (props) => {
  const [{ data, fetching }] = useSelfQuery();
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
          <LinkButton hasBox link="/">
            Logout
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

  return (
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
    >
      <Box mr="auto">Gity</Box>
      {body}
    </Flex>
  );
};

export default Header;
