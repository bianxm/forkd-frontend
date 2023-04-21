import { useLoaderData, Link } from 'react-router-dom'
import { TrashIcon } from '@heroicons/react/24/solid'
import { PencilIcon } from '@heroicons/react/24/outline'

export default function User(){
  const user_data = useLoaderData()
  return(
    <div className="h-full bg-stone-50 p-8 flex-col sm:px-44 sm:py-16">
      <div className="flex items-end w-full pl-10">
        <div className="relative">
        <img 
          className="rounded-full block h-36 w-36"
          src="/src/assets/avatars/c7.jpg"
        />
        <button className="absolute bg-gray-300 bottom-0 right-0 rounded-full w-10 h-10 mr-2 mb-2 p-2.5"><PencilIcon className="text-gray-700"/></button>
        </div>
        <div className="basis-10/12">
          <h2 className="text-3xl font-bold leading-7 text-gray-900 ml-3">{user_data.username}</h2>
          <div className="h-px bg-gray-400 mb-3 mr-5 mt-2"/>
        </div>
      </div>
      <div className="flex-auto lg:px-44 py-5 px-20">
        <ul role="list">
        {user_data.recipes.map(recipe => (
          <RecipeCard recipe={recipe} key={recipe.id}/>
        ))}
        </ul>
      </div>
    </div>
  );
}

const RecipeCard = ({ recipe }) => {
  return (
    <li className="group hover:bg-slate-300 mb-4 relative">
    <Link to={recipe.id.toString()}>
      <button className="h-12 w-12 rounded-xl 
        absolute top-1/3 right-0 mx-5 p-3 hidden 
        group-hover:block border-2 border-red-700 text-red-700
        hover:bg-red-700 hover:text-white"><TrashIcon /></button>
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
  const res = await fetch('/api/users/' + username);

  if(!res.ok){
    throw Error('User not found');
  }

  return res.json();
};
