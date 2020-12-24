import { Box, Flex } from "@chakra-ui/core";
import { useRouter } from "next/router";
import React, { FC } from "react";
import Container from "../components/Container";
import Header from "../components/Header";
import { useGetUserQuery } from "../generated/graphql";

interface UserProps
{

};

const User: FC<UserProps> = () =>
{
    const router = useRouter();
    const { user } = router.query;

    const [{fetching, data}] = useGetUserQuery({
        pause: user === undefined,
        variables: { username: user as string }
    });

    let body = null;
    
    if(!fetching && data !== undefined)
    {
        if(data?.getUser)
        {
            body = (
                <>
                <Flex
                    flexDir="column"
                    h="100%"
                    padding="35px"
                >
                    <Box
                        h="180px"
                        w="180px"
                        borderRadius="50%"
                        background="#ff11ff"
                        mx="auto"
                    />
                    <Box
                        mt="10px"
                        fontSize="28px"
                        mx="auto"
                    >
                        {user}
                    </Box>
                </Flex>
                <Box
                    h="100%"
                    w="1px"
                    background="#5A0B4D"
                />
                </>
            );
        }
        else
        {
            router.push("/404");
        }
    }
    
    return (
        <Container>
            <Header type="full"/>
                {body}
        </Container>
    );
};

export default User;
