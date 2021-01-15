import { Box } from "@chakra-ui/react";
import React from "react";

interface DividerProps
{
    mt?: string;
    mb?: string;
    position?: 'v' | 'h';
}

export default function Divider({ position = 'h', mt = '0', mb = '0' }: DividerProps)
{
    return (
        <Box
            w={position === 'h' ? "auto" : "1px"}
            h={position === 'h' ? "1px" : "auto"}
            bg="#3b3737"
            mb={mb}
            mt={mt}
        />
    );
}
