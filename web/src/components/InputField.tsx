import { InputHTMLAttributes, FC, useState } from "react";
import { FormControl, FormErrorMessage, Input, Box, Flex } from "@chakra-ui/core";
import { useField } from "formik";

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  label: string;
}

const InputField: FC<InputFieldProps> = ({ label, size: _, ...props}) => {
  const [field, { error }] = useField(props);
  const [showLabel, setLabel] = useState(true);
  let bgColor = "#524a4a";
  let show = showLabel;

  field.onBlur = () => {
    setLabel(true);
  }

  if(field.value !== "")
  {
    show = false;
  }

  if(error)
  {
    bgColor = "#c01621";
  }
  else if(!show)
  {
    bgColor = "#4c14b3";
  }

  return (
    <FormControl isInvalid={!!error}>
      <Flex
        w="auto"
        h="50px"
        bg="#0e0d0d"
        border="6px solid #0e0d0d"
        _focus={{bg: "#000000"}}
      >
        <Box
          fontSize="17px"
          pos="absolute"
          zIndex="2"
          mt="7px"
          ml="16px"
          color="#797272"
          pointerEvents="none"
          transform={show ? "none" : "translate(-15px, -95%);"}
          transition="0.2s ease-in-out;"
        >
          {label}
        </Box>
        <Input
          fontSize="17px"
          border="none"
          _focus={{border: "none"}}
          _invalid={{border: "none"}}
          onFocus={() => setLabel(false)}
          {...field}
          {...props}
        />
      </Flex>
      <Box
        h="2px"
        w="auto"
        bg={bgColor}
      />
      <FormErrorMessage fontSize="15px">{error}</FormErrorMessage>
    </FormControl>
  );
}

export default InputField;
