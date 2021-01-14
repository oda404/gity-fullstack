import React from "react";
import { Flex } from "@chakra-ui/react";

interface ContainerProps
{
    children: React.ReactNode;
}

export default function Container(props: ContainerProps)
{
    return (
        <Flex
            bgColor="#000a01"
            color="#e9e9e9"
            pos="fixed"
            h="100vh"
            w="100%"
            top="0"
            left="0"
            paddingTop="50px"
            flexDir="column"
        >
            {props.children}
        </Flex>
    );
}
