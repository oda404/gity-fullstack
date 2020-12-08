import { useRouter } from "next/router";
import { FC } from "react";
import Container from "../components/Container";
import Footer from "../components/Footer";
import Header from "../components/Header";
import UserForm from "../components/UserForm";
import { useSelfQuery } from "../generated/graphql";

interface RegisterProps
{

};

const Register: FC<RegisterProps> = () =>
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
      body = (
        <UserForm type="register"/>
      )
    }
  }

  return (
    <Container>
      <Header type="register"/>
      {body}
      <Footer/>
    </Container>
  );
};

export default Register;
