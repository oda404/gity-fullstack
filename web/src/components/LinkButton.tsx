import { Link } from "@chakra-ui/core";
import { FunctionComponent } from "react";

interface LinkButtonProps
{
  link: string;
};

const LinkButton: FunctionComponent<LinkButtonProps> = (props) =>
{
  return (
    <Link
      href={props.link}
      color="#e9e9e9"
      h="34px"
      display="flex"
      alignItems="center"
      padding="10px"
      fontSize="17px"
      bg="#212121"
      border="1px solid #4c4c4c"
      borderRadius="5px"
      _hover={{ bg: "#191919", color: "#d2d2d2" }}
      _active={{ bg: "#1a1a1a" }}
      {...props}
    />
  );
};

export default LinkButton;
