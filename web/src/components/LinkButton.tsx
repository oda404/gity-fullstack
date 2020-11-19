import { Link } from "@chakra-ui/core";
import { FunctionComponent } from "react";

interface LinkButtonProps
{
    link: string;
    hasBox: boolean
};

const LinkButton: FunctionComponent<LinkButtonProps> = (props) =>
{
    
    let boxProps = null;
    if(props.hasBox)
    {
        boxProps = {
            bg:"#212121",
            border:"1px solid #4c4c4c",
            borderRadius:"5px"
        }
    }

    return (
        <Link
            href={props.link}
            color="#e9e9e9"
            {...boxProps}
            h="34px"
            display="flex"
            alignItems="center"
            padding="10px"
            fontSize="17px"
            _hover={{ bg: "#191919", color: "#d2d2d2" }}
            _active={{ bg: "#1a1a1a" }}
            {...props}
        />
    );
};

export default LinkButton;
