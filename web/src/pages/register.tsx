import { FC } from "react";
import { Formik, Form } from "formik";
import InputField from "../components/InputField";
import { Box, Button } from "@chakra-ui/core";
import Container from "../components/Container";
import Footer from "../components/Footer";
import Header from "../components/Header";

interface RegisterProps
{

};

const Register: FC<RegisterProps> = () =>
{
  return (
    <Container>
      <Header />
      <Box
        paddingX="20px"
        bgColor="#1a1a1a"
        paddingY="17px"
        border="2px solid inherit"
        borderRadius="10px"
      >
        <Formik
          initialValues={{
            username: "",
            email: "",
            password: "",
            invitation: "",
          }}
          onSubmit={(values) => {
            console.log(values);
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <InputField name="username" label="Username" />
              <Box mt={1}>
                <InputField name="email" label="Email" />
              </Box>
              <Box mt={1}>
                <InputField name="password" label="Password" type="password" />
              </Box>
              <Box mt={1}>
                <InputField name="invitation" label="Invitation" />
              </Box>
              <Button
                mt={3}
                bg="#5c0098"
                color="#e9e9e9"
                variant="solid"
                type="submit"
                _hover={{ bg: "#530089" }}
                _active={{ bg: "#6e00b4" }}
                border="none"
                isLoading={isSubmitting}
                maxW="380px"
                w="380px"
                maxH="65px"
                h="65px"
                fontSize="18px"
              >
                Sign up
              </Button>
            </Form>
          )}
        </Formik>
      </Box>
      <Footer/>
    </Container>
  );
};

export default Register;
