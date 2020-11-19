import { InputHTMLAttributes, FC } from "react";
import { FormControl, FormErrorMessage, Input, FormLabel } from "@chakra-ui/core";
import { useField } from "formik";

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  label: string;
}

const InputField: FC<InputFieldProps> = ({ label, size: _, ...props}) => {
  const [field, { error }] = useField(props);
  return (
    <FormControl isInvalid={!!error}>
      <FormLabel color="#dfdfdf" fontSize="17.3px" htmlFor={field.name}>{label}</FormLabel>
      <Input
        color="#e9e9e9"
        borderColor="#4c4c4c"
        borderRadius="8px"
        borderWidth="1px"
        maxW="400px"
        w="400px"
        maxH="58px"
        h="58px"
        fontSize="16px"
        {...field}
        {...props}
        id={field.name}
        name={field.name}
      />
      <FormErrorMessage>{error}</FormErrorMessage>
    </FormControl>
  );
}

export default InputField;