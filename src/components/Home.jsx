import { Link, useLoaderData } from "react-router-dom";
import { useAuth } from "../contexts/AuthProvider";
import { RecipeCard } from "./User";

export const featuredLoader = async () => {
    const featured = await fetch("/api/recipes");
    if(featured.ok){
        const json = await featured.json();
        return json;
    }
}

export default function Home(){
    const { user } = useAuth();
    const featured = useLoaderData();
    console.log(featured);
    return(
        // <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="flex flex-col pb-24 bg-stone-50">
        {!user &&    <div className="h-screen flex flex-col justify-center px-6 lg:px-8">
            <h2 className="mt-4 text-center text-5xl font-bold font-serif text-gray-900">
                Forkd.
            </h2>
            <p className="text-center text-gray-800 text-xl">Recipe Journal and Version Control</p>
            { !user && <div className="text-center">
                <button className="rounded-md mx-2 my-2 px-3 py-2 outline outline-2 outline-rose-300 hover:bg-rose-300"><Link to="/signup">Sign up</Link></button>
                <button className="rounded-md mx-2 my-2 bg-rose-300 px-3 py-2 hover:bg-rose-200"><Link to="/login">Log in</Link></button>
            </div>}
            </div>}
            <div className={user? "px-36 py-24" :"px-36 w-screen"}>
            <h3 className="text-3xl font-bold font-serif text-gray-900">Featured Recipes</h3><ul>
          {/* {user_data.recipes.map(recipe => (
            <RecipeCard recipe={recipe} key={recipe.id} is_viewer_owner={false}/>
          ))} */}
                {featured.map(recipe => <RecipeCard recipe={recipe} key={recipe.id} is_viewer_owner={false} featured={true} />)}
            </ul></div>
        </div>
    );
}