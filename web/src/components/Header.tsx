import { FC, useState } from "react";
import { Flex, Box, Button } from "@chakra-ui/core";
import { useSelfQuery } from "../generated/graphql";
import LinkButton from "./LinkButton";

interface HeaderProps
{
  type: "login"|"register"|"full"
};

const Header: FC<HeaderProps> = (props) => {
  const [{ data, fetching }] = useSelfQuery();
  //const [, logoutUser] = useLogoutUserMutation();
  const [dropDownUserShown, setDropDownState] = useState(false);

  let navbarContent = null;

  if(!fetching)
  {
    if(data?.self)
    {
      navbarContent = (
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
          <Box id="transparent-overlay" display={dropDownUserShown ? "block" : "none"}
            onClick={() => {
              setDropDownState(false);
            }}
          />
          <Box id="user-dropdown" display={dropDownUserShown ? "block" : "none"}/>
        </>
      );
    }
    else
    {
      if(props.type == "full")
      {
        navbarContent = (
          <>
            <LinkButton link="/login">
              Login
            </LinkButton>
            <Box mr="10px"/>
            <LinkButton link="/register">
              Sign up
            </LinkButton>
          </>
        );
      }
      else
      {
        navbarContent = (
          <LinkButton link={`/${props.type === "register" ? "login" : "register"}`}>
            {props.type === "register" ? "Login" : "Sign up"}
          </LinkButton>
        );
      }
    }
  }

  return (
    <>
      <Flex id="banner" top="0" left="0" fontSize="32px">
        <Box id="logo" mr="auto">Gity</Box>
        {navbarContent}
      </Flex>
      <Box id="divider" top="55px" left="0"/>
    </>
  );
};

export default Header;
