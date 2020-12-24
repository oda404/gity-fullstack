import { useRouter } from "next/router";
import { FC } from "react";

interface RepoProps
{

};

const forbiddenUsernames = [
    "new",
    "404",
    "login",
    "register",
    "tos"
];

const Repo: FC<RepoProps> = () =>
{
    const router = useRouter();
    const { repo, user } = router.query;

    if(user !== undefined)
    {
        if(forbiddenUsernames.indexOf(user!.toString()) > -1)
        {
            router.push("/404");
        }
    }

    

    return (
        <div>{repo}{user}</div>
    );
};

export default Repo;
