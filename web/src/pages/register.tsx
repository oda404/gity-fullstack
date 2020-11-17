import { FC } from "react";
import Container from "../components/Container";
import Footer from "../components/Footer";
import Header from "../components/Header";
import UserForm from "../components/UserForm";

interface RegisterProps
{

};

const Register: FC<RegisterProps> = () =>
{
  return (
    <Container>
      <Header button="login"/>
        <UserForm type="register"/>
      <Footer/>
    </Container>
  );
};

export default Register;
