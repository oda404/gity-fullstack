import { Button } from "@chakra-ui/react";
import React from "react";
import FormSubmitButtonStyle from "../styles/FormSubmitButton.module.css";

interface FormSubmitButtonProps
{
    isSubmitting: boolean;
    label: string;
}

export default function FormSubmitButton(props: FormSubmitButtonProps)
{
    return (
        <Button
            id={FormSubmitButtonStyle.formSubmitButton}
            type="submit"
            isLoading={props.isSubmitting}
        >
            {props.label}
        </Button>
    );
}
