import { useLoaderData, Link } from 'react-router-dom'

export default function User(){
  const user_data = useLoaderData()
  return(
    <div className="w-screen h-screen bg-stone-50 p-8">
      <h2 className="text-2xl font-bold text-gray-900">{user_data.username}</h2>
      <h3>Recipes</h3>
      <ul role="list" class="divide-y divide-slate-200">
      {user_data.recipes.map(recipe => (
        <li>
        <Link to={recipe.id.toString()} key={recipe.id}>
          <h4>{recipe.title}</h4>
          <p>id: {recipe.id}</p>
          <p>{recipe.description}</p> 
          <p>{recipe.last_modified}</p>
        </Link>
        </li>
      ))}
      </ul>
    </div>
  );
}

export const userLoader = async ({ params }) => {
  const { username } = params; 
  const res = await fetch('/api/users/' + username);

  if(!res.ok){
    throw Error('User not found');
  }

  return res.json();
};
