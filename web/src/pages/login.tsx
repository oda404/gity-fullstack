import { useRouter } from "next/router";
import { FC } from "react";
import Container from "../components/Container";
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
      router.replace('/')
    }
    else
    {
      body = ( <UserForm type="login"/> );
    }
  }

  return (
    <Container>
      <Header type="login"/>
      {body}
    </Container>
  );
}

export default Login;

