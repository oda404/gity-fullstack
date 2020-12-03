import { Box, Flex } from "@chakra-ui/core";
import { FC } from "react";
import Container from "../components/Container";
import Footer from "../components/Footer";
import Header from "../components/Header";
import TextField from "../components/TextField";

interface NewProps
{

};

const New: FC<NewProps> = () =>
{
    return (
        <Container>
            <Header type="full"/>
            <TextField
            
            />
            <Footer/>
        </Container>
    );
}

export default New;
