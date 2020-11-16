import React from "react";
import { Box } from "@chakra-ui/core";

interface FooterProps
{

};

const Footer: React.FC<FooterProps> = () => {
    return (
        <Box
            w="100%"
            h="50px"
            bg="#161616"
            pos="fixed"
            bottom="0"
        />            
    );
};

export default Footer;
