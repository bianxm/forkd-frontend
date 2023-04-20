import { useLoaderData } from 'react-router-dom'
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
    <div className="w-screen h-screen bg-stone-50 p-8">
      <div className="lg:flex lg:items-center lg:justify-between pb-5">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">{recipe_data.timeline_items.edits[0].title}</h2>
          <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
            <div className="mt-0 text-sm text-gray-500">Last modified on {recipe_data.last_modified}</div>
            {recipe_data.forked_from && <div className="mt-0 text-sm text-gray-500">Forked from {recipe_data.forked_from}</div>}
            {recipe_data.source_url && <div className="mt-0 text-sm text-gray-500">Adapted from {recipe_data.source_url}</div>}
          </div>
        </div>
      </div>
      {/* 
      PUT BUTTONS FOR FORKING AND DELETING HERE
      <div className="mt-5 flex lg:ml-4 lg:mt-0">
        <span></span>
      </div> */}
      <div>
        Description, Ingredients, Instructions
      </div>
    </div>
  );
}
