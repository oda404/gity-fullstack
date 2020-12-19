
export function sanitizeSingleQuotes(str: string | undefined): string | undefined
{
    if(str === undefined)
    {
        return undefined;
    }
    
    let result = "";
    for(let i = 0; i < str.length; ++i)
    {
        result += str[i];
        if(str[i] === '\'')
        {
            result += '\'';
        }
    }
    return result;
}