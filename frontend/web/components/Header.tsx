import { Flex, Box, Button, Image, Link, Grid, ListItem, UnorderedList } from "@chakra-ui/react";
import React, { useState } from "react";
import styles from "../styles/Header.module.css";
import LinkButton from "../components/LinkButton";
import { useLogoutUserMutation } from "../generated/graphql";
import Divider from "./Divider";

interface HeaderProps
{
  squish?: boolean;
  type: "showLogin" | "showRegister" | "full" | "empty";
  username?: string | null;
}

export default function Header(props: HeaderProps)
{
  const [userDropdownShown, showUserDropdown] = useState(false);
  const [ runLogoutUserMutation ] = useLogoutUserMutation();
  let headerBody = null;

  if(props.username && props.username !== undefined)
  {
    headerBody = (
      <>
      <Button 
        display={userDropdownShown ? "block" : "none"}
        w="100%" 
        h="100vh" 
        bg="none" 
        _active={{bg: "none"}} 
        _hover={{bg: "none"}} 
        _focus={{boxShadow: "none"}}
        onClick={() => showUserDropdown(false)}
        pos="absolute" 
        zIndex="998" 
        left="0px" 
        top="0px"
        cursor="default"
      />
      <Flex zIndex="999">
        <Divider position="v" />
        <Grid>
          <Button
            color="#d8dbcb"
            position="relative"
            display="inline-block"
            bg="none"
            h="34px"
            alignItems="center"
            padding="10px"
            fontSize="16px"
            _hover={{ bg: "none", color: "#e1d9d9" }}
            _active={{ color: "#e1d9d9"  }}
            _focus={{ border: "none"}}
            onClick={() => showUserDropdown(!userDropdownShown)}
          >
            {props.username}
          </Button>
          <Box
            display={userDropdownShown ? "block" : "none"}
            bg="#1a1a1a"
            border="1px solid #302e2e"
            borderStyle="solid"
            borderRadius="5px"
            w="125px"
            h="auto"
            fontSize="14px"
            pos="absolute"
            whiteSpace="nowrap"
            top="55px"
            ml="-55px"
          >
            <Box
              borderStyle="solid"
              pos="absolute"
              borderColor="#302e2e transparent transparent transparent"
              borderWidth="8px 8px 0px 8px"
              left="65%"
              top="-9px"
              transform="rotate(180deg)"
            />
            <Link
              color="#cdc0c0"
              bg="none"
              h="34px"
              display="flex"
              alignItems="center"
              padding="10px"
              fontSize="14px"
              href={`/${props.username}`}
              _hover={{ bg: "none", color: "#ffffff" }}
              _active={{ color: "#e1d9d9"  }}
              _focus={{ border: "none"}}
            >
              <b>Your profile</b>
            </Link>
            <Divider />
            <Link
              color="#cdc0c0"
              bg="none"
              h="34px"
              display="flex"
              alignItems="center"
              padding="10px"
              fontSize="14px"
              _hover={{ bg: "none", color: "#ffffff" }}
              _active={{ color: "#e1d9d9"  }}
              _focus={{ border: "none"}}
              onClick={ async () => {
                await runLogoutUserMutation();
                window.location.replace('/');
              }}
            >
              <b>Logout</b>
            </Link>
          </Box>
        </Grid>
      </Flex>
      </>
    );
  }
  else
  {
    switch(props.type)
    {
    case "empty":
      
      break;
    case "full":
      headerBody = (
        <>
          <LinkButton href="/login">
            Sign in
          </LinkButton>
          <Box mr="10px"/>
          <LinkButton href="/register">
            Sign up
          </LinkButton>
        </>
      );
      break;
    default:
      headerBody = (
        <LinkButton href={`/${props.type === "showLogin" ? "login" : "register"}`}>
          {props.type === "showLogin" ? "Sign in" : "Sign up"}
        </LinkButton>
      );
      break;
    }
  }

  return (
    <Flex 
      className={`
        ${styles.header}
        ${props.squish ? styles.headerSquish : ""}`
      }
      top="0" 
      left="0" 
      fontSize="32px"
    >
      <Link _focus={{boxShadow: "none"}} href='/' mr="auto" ml={props.type === "empty" ? "auto" : "10px"}>
        <Image h="42px" w="42px" src="/images/logo.svg"/>
      </Link>
      {headerBody}
    </Flex>
  );
}
