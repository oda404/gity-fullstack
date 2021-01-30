
export function pack(message: string): string
{
    let n = (4 + message.length).toString(16);
    return Array(4 - n.length + 1).join('0') + n + message;
}
