import { Link } from "@chakra-ui/react";
import React from "react";

interface ProfileTabSelectorProps
{
  text: string;
  selected: boolean;
  onClick: () => void;
}

export default function ProfileTabSelector({text, selected, onClick}: ProfileTabSelectorProps)
{
  return (
    <Link
      fontSize="18px"
      w="auto"
      bg={selected ? "#343131" : "none"}
      color="#d8dbcb"
      padding="10px"
      _hover={{textDecoration: "none", bg:"#3b3737"}}
      onClick={onClick}
    >
      <b>{text}</b>
    </Link>
  );
}
