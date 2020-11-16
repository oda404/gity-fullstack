import { FC } from "react";
import { Box, Flex } from "@chakra-ui/core";

interface FooterProps
{

};

const Footer: FC<FooterProps> = () => {
  return (
    <Flex
      w="100%"
      h="50px"
      bg="#1a1a1a"
      pos="fixed"
      bottom="0"
      justifyItems="center"
      alignItems="center"
      padding="18px"
      fontSize="18px"
      fontFamily="Kanit"
    >
      <Box
        marginLeft="auto"
      >
        Contact: ass@gmail.com
      </Box>
    </Flex>
  );
};

export default Footer;
