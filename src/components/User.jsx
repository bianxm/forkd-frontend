import { useLoaderData, Link } from 'react-router-dom'
import { TrashIcon } from '@heroicons/react/24/solid'
import { PencilIcon, Cog8ToothIcon } from '@heroicons/react/24/outline'
import apiReq from '../ApiClient'
import { useAuth } from '../contexts/AuthProvider'
import { Tab } from '@headlessui/react'

export default function User(){
  const user_data = useLoaderData()
  const { user } = useAuth();
  const is_viewer_owner = user && user.username === user_data.username
  // console.log(user_data)
  return(
    <div className="h-full bg-stone-50 p-8 flex-col sm:px-44 sm:py-16">
      <div className="flex items-end w-full pl-10">
        <div className="relative group">
          { is_viewer_owner ?
          <Link>
        <img 
          className="rounded-full block h-36 w-36"
          src="/src/assets/avatars/c7.jpg"
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
          <button className="bg-lime-500 hover:bg-lime-400 text-bold w-full rounded-lg m-5 py-2">+ New Recipe</button>
          <ul role="list">
          {user_data.recipes.map(recipe => (
            <RecipeCard recipe={recipe} key={recipe.id} is_viewer_owner={true}/>
          ))}
          </ul>
        </Tab.Panel>
        <Tab.Panel>
          <ul role="list">
          {user_data.shared_with_me.length > 0 ?
          user_data.shared_with_me.map(recipe => (
            <RecipeCard recipe={recipe} key={recipe.id} is_viewer_owner={false}/>
          )) : <div className="py-4">Nothing shared with you yet!</div>}
          </ul>
        </Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  );
}

const RecipeCard = ({ recipe, is_viewer_owner }) => {
  return (
    <li className="group hover:bg-slate-300 mb-4 relative">
    <Link to={recipe.id.toString()}>
      {is_viewer_owner && <button className="h-12 w-12 rounded-xl 
        absolute top-1/3 right-0 mx-5 p-3 hidden 
        group-hover:block border-2 border-red-700 text-red-700
        hover:bg-red-700 hover:text-white"><TrashIcon /></button>}
      <div className="flex">
      <div className="h-36 w-36 mix-blend-multiply bg-red-200">
      <img src="/src/assets/patterns/japanese.png" 
        className="object-none mix-blend-multiply"
      /></div>
      <div className="flex flex-col justify-center ml-4">
        <small className="text-gray-600">{recipe.last_modified}</small>
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
    // console.log(res.json);
    return res.json;
  }

  throw Error('User not found');
};
