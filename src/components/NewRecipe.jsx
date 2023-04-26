import { useNavigate, useLocation } from "react-router-dom";
import { useState, useRef } from "react";
import { useAuth } from "../contexts/AuthProvider";
import apiReq from "../ApiClient";
import { useFlash } from "../contexts/FlashProvider";

export default function NewRecipe (){
    const { user } = useAuth();
    const flash = useFlash();
    const navigate = useNavigate();
    const location = useLocation();
    const hasPreviousState = location.key!=="default";
    const [isDisabled, setIsDisabled] = useState(false);
    const [recipeUrl, setRecipeUrl] = useState("");
    const [newRecipeData, setNewRecipeData] = useState({
        title: "",
        description: "",
        ingredients: "",
        instructions: "",
        url: ""
    });
    const handleRecipeChange = (e) => {
        e.target.style.height = 'inherit';
        e.target.style.height = `${e.target.scrollHeight}px`;
        setNewRecipeData( oldData => {
            return {
                ...oldData,
                [e.target.name]: e.target.value
            };
        });
    };

    async function handleExtractSubmit(e) {
        e.preventDefault();
        setIsDisabled(true);
        const response = await apiReq('GET',`/api/extract-recipe?url=${recipeUrl}`);
        const data = await response.json;
        console.log(response);
        console.log(data);
        let ingredientsText = '';
        for (const step of data.ingredients){
           ingredientsText += `${step.original}\n`; 
        }
        setNewRecipeData({
            title: data.title,
            description: data.desc,
            ingredients: ingredientsText,
            instructions: data.instructions,
            url: recipeUrl,
        });
    }    

    async function submitNewRecipe(e){
        e.preventDefault();
        console.log(newRecipeData);
        const response = await apiReq('POST','/api/recipes','',newRecipeData);
        console.log(response);
        if(response.status===201){
            navigate(`/${user.username}`);
        }else{
            flash('Cannot extract recipe','bg-red-100 border border-red-400 text-red-700');
        }
    }

    return (<div className="flex flex-col m-8">
        <form className="flex flex-row m-8 mr-24 items-center" onSubmit={handleExtractSubmit}>
           <label htmlFor="extract-url" className="text-sm font-medium">URL</label> 
           <input required value={recipeUrl} onChange={(e)=>setRecipeUrl((oldData)=>e.target.value)} type="url" id="extract-url" className="mx-4 flex-auto p-2 block rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"/>
           <button type="submit">Extract</button>
        </form>
        <form id="newRecipe" className="space-y-3 mx-8 mt-12" onSubmit={submitNewRecipe}>
            <div>
                <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900 mb-2">Title</label>
                <input className="w-full p-2 block rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300" 
                disabled={isDisabled} type="text" value={newRecipeData.title} name="title" id="title" required onChange={handleRecipeChange} />
            </div>
            <div>
                <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900 mb-2">Description</label>
                <textarea className="w-full p-2 block rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300" 
                disabled={isDisabled} value={newRecipeData.description} name="description" id="description" onChange={handleRecipeChange} />
            </div>
            <div>
                <label htmlFor="ingredients" className="block text-sm font-medium leading-6 text-gray-900 mb-2">Ingredients</label>
                <textarea className="w-full p-2 block rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300" 
                disabled={isDisabled} value={newRecipeData.ingredients} name="ingredients" id="ingredients" required onChange={handleRecipeChange} />
            </div>
            <div>
                <label htmlFor="instructions" className="block text-sm font-medium leading-6 text-gray-900 mb-2">Instructions</label>
                <textarea className="w-full p-2 block rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300" 
                disabled={isDisabled} value={newRecipeData.instructions} name="instructions" id="instructions" required onChange={handleRecipeChange} />
            </div>
            <div>
                <label htmlFor="url" className="block text-sm font-medium leading-6 text-gray-900 mb-2">Source URL</label>
                <input className="w-full p-2 block rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300" 
                disabled={isDisabled} type="text" value={newRecipeData.url} name="url" id="url" onChange={handleRecipeChange} />
            </div>
        </form>
        <div className="text-center">
        <button className="outline outline-2 outline-gray-400 hover:bg-gray-400 text-bold rounded-lg my-5 mx-2 py-2 px-16"
        onClick={()=>{
            if(hasPreviousState) navigate(-1);
            else navigate(`/${user.username}`);
        }}
        >Cancel</button>
        <button type="submit" form="newRecipe" className="bg-lime-500 hover:bg-lime-400 text-bold rounded-lg my-5 mx-2 py-2 px-16">Save</button>
        </div>
    </div>);
}