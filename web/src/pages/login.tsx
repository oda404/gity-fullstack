import { FC } from "react";
import Container from "../components/Container";
import Footer from "../components/Footer";
import Header from "../components/Header";

interface LoginProps
{

};

const Login: FC<LoginProps> = () =>
{
    return (
        <Container>
            <Header button="register"/>
            <div>Login page</div>
            <Footer/>
        </Container>
    );
}

export default Login;

