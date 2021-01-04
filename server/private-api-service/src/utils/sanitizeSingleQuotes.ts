
export function sanitizeSingleQuotes(str: string): string
{    
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