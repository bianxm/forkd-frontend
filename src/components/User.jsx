import { useLoaderData, Link, useNavigate } from 'react-router-dom'
import { TrashIcon } from '@heroicons/react/24/solid'
import { PencilIcon, Cog8ToothIcon } from '@heroicons/react/24/outline'
import apiReq from '../ApiClient'
import { useAuth } from '../contexts/AuthProvider'
import { Tab } from '@headlessui/react'
import { useFlash } from '../contexts/FlashProvider';
import { useState } from 'react'

export default function User(){
  const user_data = useLoaderData();
  const { user } = useAuth();
  const is_viewer_owner = user && user.username === user_data.username
  console.log(user_data)
  return(
    <div className="h-full bg-stone-50 p-8 flex-col sm:px-44 sm:py-16">
      <div className="flex items-end w-full pl-10">
        <div className="relative group">
          { is_viewer_owner ?
          <Link to="/settings">
        <img 
          className="rounded-full block h-36 w-36"
          src={user.img_url? user.img_url : "/src/assets/avatars/av4.jpg"}
        />
        <div className="absolute hidden group-hover:block bg-gray-300 bottom-0 right-0 rounded-full w-10 h-10 mr-2 mb-2 p-2.5"><Cog8ToothIcon className="text-gray-700"/></div>
        </Link>:
        <img 
          className="rounded-full block h-36 w-36"
          src="/src/assets/avatars/c7.jpg"
        />
        }
        </div>
        <div className="basis-10/12">
          <h2 className="text-3xl font-bold leading-7 text-gray-900 ml-3">{user_data.username}</h2>
          <div className="h-px bg-gray-400 mb-3 mr-5 mt-2"/>
        </div>
      </div>
      <div className="flex-auto lg:px-44 py-5 px-20">
        {is_viewer_owner ? <OwnRecipes user_data={user_data}/> : 
          <ul role="list">
          {user_data.recipes.map(recipe => (
            <RecipeCard recipe={recipe} key={recipe.id} is_viewer_owner={false}/>
          ))}
          </ul>
        }
      </div>
    </div>
  );
}

const OwnRecipes = ({ user_data }) => {
  const [myRecipes, setMyRecipes] = useState(user_data.recipes);
  return (
    <Tab.Group>
      <Tab.List>
        <Tab className="p-2 mx-1 rounded-md ui-selected:bg-rose-300 ui-not-selected:outline ui-not-selected:outline-rose-300 ui-not-selected:outline-2">
          My Recipes</Tab>
        <Tab className="p-2 mx-1 rounded-md ui-selected:bg-rose-300 ui-not-selected:outline ui-not-selected:outline-rose-300 ui-not-selected:outline-2">
          Shared With Me</Tab>
      </Tab.List>
      <Tab.Panels>
        <Tab.Panel>
          <Link to="/new"><button className="bg-lime-500 hover:bg-lime-400 text-bold w-full rounded-lg m-5 py-2">+ New Recipe</button></Link>
          <ul role="list">
          {myRecipes.map(recipe => (
            <RecipeCard recipe={recipe} key={recipe.id} is_viewer_owner={true} myRecipes={myRecipes} setMyRecipes={setMyRecipes}/>
          ))}
          </ul>
        </Tab.Panel>
        <Tab.Panel>
          <ul role="list" className="py-8">
          {user_data.shared_with_me.length > 0 ?
          user_data.shared_with_me.sort((a,b)=>(a.last_modified < b.last_modified)?1:-1).map(recipe => (
            <RecipeCard recipe={recipe} key={recipe.id} is_viewer_owner={false}/>
          )) : <div className="py-4">Nothing shared with you yet!</div>}
          </ul>
        </Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  );
}

export const RecipeCard = ({ recipe, is_viewer_owner, myRecipes, setMyRecipes, featured }) => {
  const flash = useFlash();
  const navigate = useNavigate();
  recipe.last_modified = new Date(recipe.last_modified);
  async function deleteRecipe(){
    if(confirm('Are you sure you want to delete this recipe? It cannot be undone.')){
      const response = await apiReq('DELETE',`/api/recipes/${recipe.id}`)
      if(response.status===200){
        setMyRecipes(myRecipes.filter(r => r.id !== recipe.id));
        flash('Recipe deleted','bg-green-100 border border-green-400 text-green-700');
      }else {
        flash('Sorry, something went wrong','bg-red-100 border border-red-400 text-red-700');
      }
    }
  }
  return (
    <li className="group hover:bg-slate-300 mb-4 relative">
    {is_viewer_owner && <button onClick={deleteRecipe}
      className="h-12 w-12 rounded-xl 
      absolute top-1/3 right-0 mx-5 p-3 hidden 
      group-hover:block border-2 border-red-700 text-red-700
      hover:bg-red-700 hover:text-white"><TrashIcon /></button>}
    <Link to={`/${recipe.owner}/${recipe.id}`}>
      <div className="flex">
      <div className="h-36 w-36 mix-blend-multiply bg-red-200">
      <img src="/src/assets/patterns/japanese.png" 
        className="object-none mix-blend-multiply"
      /></div>
      <div className="flex flex-col justify-center ml-4">
        <small className="text-gray-600">{recipe.last_modified.toLocaleString()}</small>
        {featured && <p className="font-bold">{recipe.owner}/</p>}
        <h3 className="font-bold text-xl">{recipe.title}</h3>
        <p>{recipe.description}</p> 
      </div>
      </div>
    </Link>
    </li>
  );
};

export const userLoader = async ({ params }) => {
  const { username } = params; 
  const res = await apiReq('get', `/api/users/${username}`);

  if(res.ok || res.status == 401){
    const data = res.json;
    // for(const recipe of data.recipes){
    //   recipe.last_modified = new Date(recipe.last_modified);
    // }
    return data;
  }

  throw Error('User not found');
};
