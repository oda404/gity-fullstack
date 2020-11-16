import { FC } from "react";
import { Flex } from "@chakra-ui/core";

interface ContainerProps
{

};

const Container: FC<ContainerProps> = (props) => {
  return (
    <Flex
      direction="row"
      alignItems="center"
      justifyContent="center"
      bgColor="#212121"
      color="white"
      {...props}
      minH="100%"
      minW="100%"
      w="100%"
      h="auto"
      pos="fixed"
      top="0"
      left="0"
    />
  );
};

export default Container;
