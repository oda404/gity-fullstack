import { FC } from "react";
import { Flex, Box, Link } from "@chakra-ui/core";
import NextLink from "next/link";

interface HeaderProps
{
  button: "login"|"register"
};

const Header: FC<HeaderProps> = (props) => {
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
      <Box>Gity</Box>
      <NextLink href={`/${props.button}`}>
        <Link
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
          _active={{ bg: "#530089" }}
          marginLeft="auto"
        >
          {props.button === "login" ? "Login" : "Sign up"}
        </Link>
      </NextLink>
    </Flex>
  );
};

export default Header;
