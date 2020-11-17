import { FC } from "react";
import { Flex } from "@chakra-ui/core";

interface ContainerProps
{

};

const Container: FC<ContainerProps> = (props) => {
  return (
    <Flex
      alignItems="center"
      justifyContent="center"
      bgColor="#212121"
      color="white"
      pos="fixed"
      minH="100%"
      minW="100%"
      top="0"
      left="0"
      {...props}
    />
  );
};

export default Container;
