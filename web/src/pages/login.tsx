import { useRouter } from "next/router";
import { FC } from "react";
import Container from "../components/Container";
import Footer from "../components/Footer";
import Header from "../components/Header";
import UserForm from "../components/UserForm";
import { useSelfQuery } from "../generated/graphql";

interface LoginProps
{

};

const Login: FC<LoginProps> = () =>
{
  const [{data, fetching}] = useSelfQuery();
  const router = useRouter();

  let body = null;

  if(!fetching)
  {
    if(data?.self)
    {
      router.push('/')
    }
    else
    {
      body = ( <UserForm type="login"/> );
    }
  }

  return (
    <Container>
      <Header content="register"/>
        {body}
      <Footer/>
    </Container>
  );
}

export default Login;

