
export const validServices = [ 
    "git-upload-pack", 
    "git-receive-pack" 
];

export function isServiceValid(service: string): boolean
{
    return !(validServices.indexOf(service) === -1)
}
