import { FC } from "react";
import { Flex, Button, Box } from "@chakra-ui/core";

interface HeaderProps
{

};

const Header: FC<HeaderProps> = () => {
  return (
    <Flex
      w="100%"
      h="55px"
      bg="#1a1a1a"
      pos="fixed"
      top="0"
      left="0"
      padding="18px"
      justifyItems="center"
      alignItems="center"
      fontSize="32px"
      fontFamily="Kanit"
    >
      <Box>Gity</Box>
      <Button
        color="#e9e9e9"
        bg="#212121"
        border="1px solid #4c4c4c"
        h="34px"
        fontSize="17px"
        _hover={{ bg: "#191919", color: "#d2d2d2" }}
        _active={{ bg: "#530089" }}
        marginLeft="auto"
      >
        Login
      </Button>
    </Flex>
  );
};

export default Header;
