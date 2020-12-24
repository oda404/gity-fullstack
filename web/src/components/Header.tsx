import { FC, useState } from "react";
import { Flex, Box } from "@chakra-ui/core";
import { useLogoutUserMutation, useSelfQuery } from "../generated/graphql";
import LinkButton from "./LinkButton";
import TextButton from "./TextButton";
import { useRouter } from "next/router";

interface HeaderProps
{
  type: "login"|"register"|"full"
};

const Header: FC<HeaderProps> = (props) => {
  const [{ data, fetching }] = useSelfQuery();
  const router = useRouter();
  const [, logoutUser] = useLogoutUserMutation();
  const [dropDownUserShown, setDropDownState] = useState(false);

  let navbarContent = null;

  if(!fetching)
  {
    if(data?.self)
    {
      navbarContent = (
        <>
          <Box
            h="100%"
            w="1px"
            bg="#3b3737"
            mr="4px"
          />
          <TextButton
            mr="unset"
            ml="unset"
            onClick={ () => {
              setDropDownState(!dropDownUserShown);
            }}
          >
            {data.self.username}
          </TextButton>
          { dropDownUserShown ? (
            <>
              <Box id="transparent-overlay" display="block"
                onClick={() => {
                  setDropDownState(false);
                }}
              />
              <Box id="user-dropdown">
                <TextButton mr="auto" ml="auto" onClick={
                  () => {
                    router.push(`/${data.self?.username}`)
                  }
                }>Your profile</TextButton>
                <Box id="user-dropdown-divider"/>
                <Box mt="auto" id="user-dropdown-divider"/>
                <TextButton mr="auto" ml="auto" onClick={
                  async () => {
                    await logoutUser();
                    window.location.reload();
                  }
                }>Log out</TextButton>
              </Box>
            </>
          ): null }
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
    </>
  );
};

export default Header;
