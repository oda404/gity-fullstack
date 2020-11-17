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
      <FormLabel color="#e9e9e9" fontFamily="Kanit" fontSize="17px" htmlFor={field.name}>{label}</FormLabel>
      <Input
        color="#e9e9e9"
        borderColor="#4c4c4c"
        borderRadius="8px"
        borderWidth="1px"
        {...field}
        {...props}
        id={field.name}
        name={field.name}
        pos="relative"
        maxW="380px"
        w="380px"
        maxH="50px"
        h="50px"
        fontSize="15px"
      />
      { error ? <FormErrorMessage>{error}</FormErrorMessage> : null }
    </FormControl>
  );
}

export default InputField;