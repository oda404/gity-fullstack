import { FC } from "react";
import { Flex } from "@chakra-ui/core";

interface ContainerProps
{

};

const Container: FC<ContainerProps> = (props) => {
  return (
    <Flex
      bgColor="#212121"
      color="#e9e9e9"
      pos="fixed"
      h="100%"
      w="100%"
      top="0"
      left="0"
      {...props}
    />
  );
};

export default Container;
