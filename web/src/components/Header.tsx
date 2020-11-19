import { FC, useState } from "react";
import { Flex, Box, Button } from "@chakra-ui/core";
import { useLogoutUserMutation, useSelfQuery } from "../generated/graphql";
import LinkButton from "./LinkButton";

interface HeaderProps
{
  content: "login"|"register"|"full"
};

const Header: FC<HeaderProps> = (props) => {
  const [{ data, fetching }] = useSelfQuery();
  const [, logoutUser] = useLogoutUserMutation();
  const [dropDownUserShown, setDropDownState] = useState(false);
  let body = null;

  if(!fetching)
  {
    if(data?.self)
    {
      body = (
        <>
          <Button
            color="#e9e9e9"
            bg="none"
            h="34px"
            display="flex"
            alignItems="center"
            padding="10px"
            fontSize="17px"
            _hover={{ bg: "none", color: "#d2d2d2" }}
            _active={{ color: "#e2e2e2"  }}
            _focus={{ border: "none", color: "#e2e2e2"}}
            onClick={ () => {
              setDropDownState(!dropDownUserShown);
              //await logoutUser();
              //window.location.reload();
            }}
          >
            {data.self.username}
          </Button>
          <Box
            display={dropDownUserShown ? "block" : "none"}
            pos="fixed"
            h="100%"
            w="100%"
            top="0"
            left="0"
            zIndex="1"
            onClick={() => {
              setDropDownState(false);
            }}
          />
          <Box
            display={dropDownUserShown ? "block" : "none"}
            pos="absolute"
            w="160px"
            h="350px"
            top="85%"
            right="30px"
            bg="#212121"
            border="1px solid #000000"
            borderRadius="8px"
            zIndex="998"
            boxShadow="rgba(0, 0, 0, 0.35) 0px 5px 15px"
            />
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
