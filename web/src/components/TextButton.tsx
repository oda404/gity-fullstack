import { Button } from "@chakra-ui/core";
import { FC } from "react";

interface TextButtonProps
{
  onClick: () => void;
  mr: string;
  ml: string;
};

const TextButton: FC<TextButtonProps> = (props) =>
{
  return (
    <Button
      color="#d8cbcb"
      bg="none"
      h="34px"
      display="flex"
      alignItems="center"
      padding="10px"
      fontSize="16px"
      _hover={{ bg: "none", color: "#e1d9d9" }}
      _active={{ color: "#e1d9d9"  }}
      _focus={{ border: "none"}}
      {...props}
    />
  );
}

export default TextButton;
