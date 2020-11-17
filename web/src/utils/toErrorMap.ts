import { UserFieldError } from "../generated/graphql";

export function toErrorMap(errors: UserFieldError[])
{
    const errorMap: Record<string, string> = {};
    errors.forEach(({ field, error }) => {
        errorMap[field] = error;
    });
    return errorMap;
}