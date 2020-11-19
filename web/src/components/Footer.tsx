import { FC } from "react";
import { Box, Flex } from "@chakra-ui/core";

interface FooterProps
{

};

const Footer: FC<FooterProps> = () => {
  return (
    <>
      <Box
        pos="fixed"
        left="0"
        bottom="50"
        w="100%"
        h="1px"
        bg="#312e2e"
      />
      <Flex
        w="100%"
        h="50px"
        bg="#1a1a1a"
        pos="fixed"
        bottom="0"
        left="0"
        alignItems="center"
        padding="18px"
        fontSize="18px"
        fontFamily="Kanit"
        zIndex="999"
      >
        <Box
          marginLeft="auto"
        >
          Contact: ass@gmail.com
        </Box>
      </Flex>
    </>
  );
};

export default Footer;
