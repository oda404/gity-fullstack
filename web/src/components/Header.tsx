import React from "react";
import { Box, Button } from "@chakra-ui/core";

interface HeaderProps
{

};

const Header: React.FC<HeaderProps> = () => {
    return (
        <Box
            w="100%"
            h="55px"
            bg="#161616"
            pos="fixed"
            top="0"
            left="0"
            padding="18px"
            display="flex"
            justifyItems="center"
            alignItems="center"
            fontSize="32px"
            fontFamily="Kanit"
        >
            Gity
            <Button
                color="white"
                bg="#5c0098"
                fontSize="17px"
                _hover={{ bg: "#6e00b4" }}
                _active={{ bg: "#530089" }}
                marginLeft="auto"
            >
                Login
            </Button>

            <Button
                color="white"
                bg="#5c0098"
                fontSize="17px"
                _hover={{ bg: "#6e00b4" }}
                _active={{ bg: "#530089" }}
                marginLeft="14px"
            >
                Contact
            </Button>
            
        </Box>
    );
};

export default Header;
