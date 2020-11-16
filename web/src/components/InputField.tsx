import React, { InputHTMLAttributes } from "react";
import { FormControl, FormErrorMessage, Input, FormLabel } from "@chakra-ui/core";
import { useField } from "formik";

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
    name: string;
    label: string;
}

const InputField: React.FC<InputFieldProps> = ({ label, size: _, ...props}) => {
    const [field, { error }] = useField(props);
    return (
        <FormControl isInvalid={!!error}>
            <FormLabel fontFamily="Kanit" fontSize="20px" font="" htmlFor={field.name}>{label}</FormLabel>
            <Input
                color="white"
                borderColor="#4c4c4c"
                borderRadius="8px"
                borderWidth="1px"                
                {...field}
                {...props}
                id={field.name}
                maxW="340px"
                w="340px"
                maxH="50px"
                h="50px"
                fontSize="17px"
            />
            { error ? <FormErrorMessage>{error}</FormErrorMessage> : null }
        </FormControl>
    );
}

export default InputField;
