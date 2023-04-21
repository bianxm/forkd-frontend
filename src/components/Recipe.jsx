import { useLoaderData, Link } from 'react-router-dom'
export const recipeLoader = async ({ params }) => {
  const { recipe_id, username } = params;
  const res = await fetch('/api/recipes/' + recipe_id + '?owner=' + username);

  if(!res.ok){
    throw Error('Recipe not found');
  }

  return res.json();
};

export default function Recipe(){
  const recipe_data = useLoaderData()
  console.log(recipe_data);
  return(
    <div className="w-screen bg-stone-50 p-8">
      <div className="lg:flex lg:items-center lg:justify-between pb-5">
        <div className="min-w-0 flex-1">
          <Link to={`/${recipe_data.owner}`}><h3 className="text-xl hover:text-indigo-800">{recipe_data.owner}/</h3></Link>
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">{recipe_data.timeline_items.edits[0].title}</h2>
          <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
            <div className="mt-0 text-sm text-gray-500">Last modified on {recipe_data.last_modified}</div>
            {recipe_data.forked_from && <div className="mt-0 text-sm text-gray-500">Forked from {recipe_data.forked_from}</div>}
            {recipe_data.source_url && <div className="mt-0 text-sm text-gray-500">Adapted from {recipe_data.source_url}</div>}
          </div>
          <button className="px-3 py-1 border-2 border-gray-600 text-gray-600 hover:text-white hover:bg-gray-600 m-1 rounded-lg">Fork</button>
          <button className="text-red-700 border-2 border-red-700 hover:bg-red-700 hover:text-white px-3 py-1 m-1 rounded-lg">Delete</button>
        </div>
      </div>
      <div className="flex flex-wrap">
        <RecipeDetails recipe={recipe_data} />
        <RecipeTimeline recipe={recipe_data} />
      </div>
      {/* 
      PUT BUTTONS FOR FORKING AND DELETING HERE
      <div className="mt-5 flex lg:ml-4 lg:mt-0">
        <span></span>
      </div> */}
    </div>
  );
}

const RecipeDetails = ({ recipe }) => {
  const recipe_details = recipe.timeline_items.edits[0]
  return (
    <div className="w-7/12">
      <div className="h-40 bg-red-300">
        <img src="/src/assets/patterns/japanese.png" className="object-cover mix-blend-multiply h-full w-full"/>
      </div>
      <p>{recipe_details.description}</p>
      <h4>Ingredients</h4>
      <p>{recipe_details.ingredients}</p>
      <h4>Instructions</h4>
      <p>{recipe_details.instructions}</p>
    </div>
  );
};

const RecipeTimeline = () => {
  return (
    <div>
      Hello
    </div>
  );
}

const Experiment = () => {
  return (<></>);
};

const Edit = () => {
  return (<></>);
};