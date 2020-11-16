import React from "react";
import { Formik, Form } from "formik";
import InputField from "../components/InputField";
import { Box, Button } from "@chakra-ui/core";
import Container from "../components/Container";
import Footer from "../components/Footer";
import Header from "../components/Header";

interface RegisterProps
{

};

const Register: React.FC<RegisterProps> = ({}) => {
    return (
        <Container>
            <Header/>
            <Box
                paddingX="20px"
                bgColor="#161616"
                paddingY="17px"
                border="2px solid inherit"
                borderRadius="10px"
            >
                <Formik
                    initialValues={{username: "", email: "", password: "", invitation: ""}}
                    onSubmit={(values) => { console.log(values) }}
                >

                {({ isSubmitting }) => (
                    <Form>
                        <InputField
                            name="username"
                            label="Username:"
                        />
                        <Box mt={2}>
                            <InputField
                                name="email"
                                label="Email:"
                            />
                        </Box>
                        <Box mt={2}>
                            <InputField
                                name="password"
                                label="Password:"
                                type="password"
                            />
                        </Box>
                        <Box mt={2}>
                            <InputField
                                name="invitation"
                                label="Invitation:"
                            />
                        </Box>
                        <Button
                            mt={3}
                            bg="#5c0098"
                            variant="solid"
                            type="submit"
                            _hover={{ bg: "#6e00b4" }}
                            _active={{ bg: "#530089" }}
                            border="none"
                            isLoading={isSubmitting}
                            maxW="340px"
                            w="340px"
                            maxH="50px"
                            h="50px"
                            fontSize="18px"
                        >
                            Register
                        </Button>
                    </Form>
                )}
                </Formik>
            </Box>
        <Footer/>
        </Container>
    );
}

export default Register;
