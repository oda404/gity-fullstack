import { Box, Flex } from "@chakra-ui/core";
import { useRouter } from "next/router";
import React, { FC } from "react";
import Container from "../components/Container";
import Footer from "../components/Footer";
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
                    paddingTop="25px"
                    paddingBottom="15px"
                    flexDir="column"
                    w="100%"
                >
                    <Flex
                        flexDir="column"
                    >
                        <Box 
                            mx="auto"
                            background="#000000"
                            h="150px"
                            w="150px" 
                            borderRadius="50%"
                            mb="10px"
                        />
                        <Box mx="auto" fontSize="28px">
                            {user}
                        </Box>
                    </Flex>
                    <Box background="#312e2e" w="100%" h="1px"/>
                </Flex>
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
            <Footer/>
        </Container>
    );
};

export default User;
