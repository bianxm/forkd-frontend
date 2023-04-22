import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthProvider";

export default function Home(){
    const { user } = useAuth();
    // console.log(user)
    return(
        <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
            <h2 className="mt-4 text-center text-5xl font-bold font-serif text-gray-900">
                Forkd.
            </h2>
            <p className="text-center text-gray-800 text-xl">Recipe Journal and Version Control</p>
            { !user && <div className="text-center">
                <button className="rounded-md mx-2 my-2 px-3 py-2 outline outline-2 outline-rose-300 hover:bg-rose-300"><Link to="/signup">Sign up</Link></button>
                <button className="rounded-md mx-2 my-2 bg-rose-300 px-3 py-2 hover:bg-rose-200"><Link to="/login">Log in</Link></button>
            </div>}
        </div>
    );
}