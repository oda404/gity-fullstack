import { FC } from "react";
import Container from "../components/Container";
import Footer from "../components/Footer";
import Header from "../components/Header";
import UserForm from "../components/UserForm";

interface LoginProps
{

};

const Login: FC<LoginProps> = () =>
{
  return (
    <Container>
      <Header button="register"/>
        <UserForm type="login"/>
      <Footer/>
    </Container>
  );
}

export default Login;

