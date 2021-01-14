import { Link } from "@chakra-ui/react";
import React from "react";

interface LinkButtonProps
{
    href: string;
    children: React.ReactNode;
}

export default function LinkButton(props: LinkButtonProps)
{
    return (
        <Link
            href={props.href}
            color="#e9e9e9"
            h="34px"
            display="flex"
            alignItems="center"
            padding="10px"
            fontSize="16px"
            bg="#212121"
            border="1px solid #4c4c4c"
            borderRadius="5px"
            _hover={{ bg: "#191919", color: "#d2d2d2", textDecoration: "none" }}
            _active={{ bg: "#1a1a1a" }}
            _focus={{boxShadow: "none"}}
        >
            {props.children}
        </Link>
    );
}
