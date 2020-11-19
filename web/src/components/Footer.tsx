import { FC } from "react";
import { Box, Flex } from "@chakra-ui/core";

interface FooterProps
{

};

const Footer: FC<FooterProps> = () => {
  return (
    <>
      <Box id="divider" left="0" bottom="55" />
      <Flex id="banner" bottom="0" left="0" fontSize="18px">
        <Box marginLeft="auto">
          Contact: ass@gmail.com
        </Box>
      </Flex>
    </>
  );
};

export default Footer;
