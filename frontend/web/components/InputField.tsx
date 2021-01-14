import { InputHTMLAttributes, useState } from "react";
import { FormControl, FormErrorMessage, Input, Box, Flex, Grid, UnorderedList, ListItem, List } from "@chakra-ui/react";
import { useField } from "formik";
import { QuestionOutlineIcon } from "@chakra-ui/icons";
import InputFieldStyle from "../styles/InputField.module.css";

interface InfoBubble
{
  info: string[]
}

interface InputFieldProps
{
  fieldProps: InputHTMLAttributes<HTMLInputElement> & {
    name: string;
    label: string;
  };
  infoBubble?: InfoBubble;
}

export default function InputField({ 
  infoBubble, 
  fieldProps: { size, ...props } 
}: InputFieldProps)
{
  const [field, { error }] = useField(props);
  const [isLabelShown, setLabel] = useState(true);
  const [infoBubbleShown, setInfoBubble] = useState(false);
  let bgColor = "#524a4a";
  let show = isLabelShown;

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
        h="47px"
        bg="#0e0d0d"
        _focus={{bg: "#000000"}}
      >
        <Box
          fontSize="17px"
          pos="absolute"
          zIndex="2"
          mt="10px"
          ml="16px"
          color={show ? "#797272" : "#c3b2b2"}
          pointerEvents="none"
          transform={show ? "none" : "translate(-10px, -85%);"}
          transition="0.2s ease-in-out;"
        >
          {props.label}
        </Box>
        <Input
          mt="2px"
          fontSize="17px"
          border="none"
          _focus={{border: "none"}}
          _invalid={{border: "none"}}
          onFocus={() => setLabel(false)}
          {...field}
          {...props}
        />
        {infoBubble === undefined ? null :
          <Grid
            alignItems="center"
          >
            <QuestionOutlineIcon
              ml="auto"
              mr="15px"
              color="gray.200"
              boxSize="19px"
              onPointerEnter={() => setInfoBubble(true)}
              onPointerLeave={() => setInfoBubble(false)}
            />
            { infoBubbleShown ? 
              <Box
                className={InputFieldStyle.speechBubble}
              >
                <Box className={InputFieldStyle.arrow} />
                <UnorderedList>
                  {infoBubble.info.map(info => 
                    <ListItem>
                      {info}
                    </ListItem>
                  )}
                </UnorderedList>
              </Box> 
              : null 
            }
          </Grid>
        }
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
