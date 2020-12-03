import { Formik, Form } from "formik";
import InputField from "../components/InputField";
import { Box, Button, Link } from "@chakra-ui/core";
import { FC } from "react";
import { useRouter } from "next/router";
import { useLoginUserMutation, useRegisterUserMutation } from "../generated/graphql";

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
        const response = await registerUser({ userInput: values });
        if(response.data?.registerUser.error)
        {
          let error: Record<string, string> = {};
          error[response.data.registerUser.error.field] = response.data.registerUser.error.message;
          setErrors(error);
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
          <Box mt={5}>
            <InputField name="email" label="Email" />
          </Box>
          <Box mt={5}>
            <InputField name="password" label="Password" type="password" />
          </Box>
          <Box mt={5}>
            <InputField name="invitation" label="Invitation" />
          </Box>
          <Button
            id="form-submit-button"
            type="submit"
            isLoading={isSubmitting}
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
        const response = await loginUser({ userInput: values });
        if(response.data?.loginUser.error)
        {
          let error: Record<string, string> = {};
          error[response.data.loginUser.error.field] = response.data.loginUser.error.message;
          setErrors(error);
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
          <Box mt={5}>
            <InputField name="password" label="Password" type="password" />
          </Box>
          <Button
            id="form-submit-button"
            type="submit"
            isLoading={isSubmitting}
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
      boxShadow="rgba(0, 0, 0, 0.35) 0px 5px 15px"
      mx="auto"
    >
      {form}
      {props.type === "register" ? <Box mt="13px" color="#b1a4a4" fontSize="12px">
        By signing up for Gity, you agree to our <Link href="/tos" color="#12a0d3" variant="link">Terms of service</Link>
        .
      </Box> : null}
    </Box>
  );
}

export default UserForm;
