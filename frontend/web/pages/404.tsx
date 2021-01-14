import { Box } from "@chakra-ui/react";
import React from "react";
import Container from "../components/Container";
import Header from "../components/Header";


export default function UhOh()
{
  return (
    <Container>
      <Header type="empty" squish />
      <Box color="#d8dbcb" mx="auto" mt="10%">
        <b>Psssst...</b>
      </Box>
      <Box mx="auto" fontSize="50px">
        <b>You done 404'd.</b>
      </Box>
    </Container>
  )
}
