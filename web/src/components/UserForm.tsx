import { Formik, Form } from "formik";
import InputField from "../components/InputField";
import { Box, Button, Link } from "@chakra-ui/core";
import { FC } from "react";
import { useRouter } from "next/router";
import { useLoginUserMutation, useRegisterUserMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";

interface UserFormProps
{
  type: "login" | "register"
};

const UserForm: FC<UserFormProps> = (props) =>
{
  const [, registerUser] = useRegisterUserMutation();
  const [, loginUser] = useLoginUserMutation();
  const router = useRouter();

  const form = (props.type === "register") ? (
    <Formik
      initialValues={{
        username: "",
        email: "",
        password: "",
        invitation: ""
      }}
      onSubmit={ async (values, { setErrors }) => {
        const response = await registerUser(values);
        if(response.data?.registerUser.errors)
        {
          setErrors(toErrorMap(response.data.registerUser.errors));
        }
        else if(response.data?.registerUser.user)
        {
          router.push("/login");
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <InputField name="username" label="Username" />
          <Box mt={1}>
            <InputField name="email" label="Email" type="email" />
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
            type="submit"
            _hover={{ bg: "#530089" }}
            _active={{ bg: "#6e00b4" }}
            isLoading={isSubmitting}
            maxW="400px"
            w="400px"
            maxH="70px"
            h="70px"
            fontSize="18px"
          >
            Sign up
          </Button>
        </Form>
      )}
    </Formik>
  )
  :
  (
    <Formik
      initialValues={{
        usernameOrEmail: "",
        password: ""
      }}
      onSubmit={ async (values, { setErrors }) => {
        const response = await loginUser(values);
        if(response.data?.loginUser.errors)
        {
          setErrors(toErrorMap(response.data?.loginUser.errors));
        }
        else if(response.data?.loginUser.user)
        {
          router.push('/');
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <InputField name="usernameOrEmail" label="Username or Email" />
          <Box mt={1}>
            <InputField name="password" label="Password" type="password" />
          </Box>
          <Button
            mt={3}
            bg="#5c0098"
            color="#e9e9e9"
            type="submit"
            _hover={{ bg: "#530089" }}
            _active={{ bg: "#6e00b4" }}
            isLoading={isSubmitting}
            maxW="400px"
            w="400px"
            maxH="70px"
            h="70px"
            fontSize="18px"
          >
            Log in
          </Button>
        </Form>
      )}
    </Formik>
  )

  return (
    <Box
      paddingX="20px"
      bgColor="#1a1a1a"
      paddingY="17px"
      border="2px solid inherit"
      borderRadius="10px"
      alignSelf="center"
      ml="auto"
      mr="auto"
    >
      {form}
      {props.type === "register" ? <Box mt="13px" fontSize="12px">
        By signing up for Gity, you agree to our <Link href="/tos" color="#12a0d3" variant="link">Terms of service</Link>
        .
      </Box> : null}
    </Box>
  );
}

export default UserForm;
