import { Link, useNavigate, useLocation } from 'react-router-dom'
export default function NotFound(){
    const navigate = useNavigate();
    const location = useLocation();
    const hasPreviousState = location.key !== "default";

    const exit404 = () => {
        if(hasPreviousState) navigate(-1);
        else navigate("/");
    };

    return (
        <div className="flex min-h-full flex-col justify-center items-center align-center px-6 py-44 lg:px-8">
            <h2 className="mt-4 text-center text-5xl font-bold font-serif text-gray-900">
                404 Not Found.
            </h2>
                <button className="rounded-md mx-2 my-2 px-3 py-2 outline outline-2 outline-rose-300 hover:bg-rose-300"
                    onClick={exit404}>
                        {hasPreviousState ? "Go Back" : "Go Home"}
                </button>
        </div>
    );
}

// Credit to Evelyn Hathaway for using the fact that location.key === "default" when first entering a site for the Go Back/ Go Home button
// https://stackoverflow.com/questions/65863355/how-to-use-usenavigate-previous-page-without-accidentally-leaving-my-site