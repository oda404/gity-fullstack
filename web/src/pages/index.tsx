import { Box } from "@chakra-ui/core";
import { FC } from "react";
import Container from "../components/Container";
import Footer from "../components/Footer";
import Header from "../components/Header";

interface IndexProps
{

};

const Index: FC<IndexProps> = () =>
{
  return (
    <Container>
      <Header content="full"/>
      <Box mr="auto" ml="auto" alignSelf="center">
        Welcome to Gity
      </Box>
      <Footer/>
    </Container>
  );
};

export default Index
