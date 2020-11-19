import { FC } from "react";
import Container from "../components/Container";
import Footer from "../components/Footer";
import Header from "../components/Header";

interface tosProps
{

};

const tos: FC<tosProps> = () =>
{
  return (
    <Container>
      <Header type="full"/>
      <Footer/>
    </Container>
  );
}

export default tos;
