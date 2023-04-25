import { useLoaderData, Link } from 'react-router-dom'
import apiReq from '../ApiClient'
import { useAuth } from '../contexts/AuthProvider';
import { PencilIcon } from '@heroicons/react/24/solid';
import { useState, useEffect, useRef } from 'react';
import { Dialog, Disclosure } from '@headlessui/react';
import * as Diff2Html from 'diff2html';
import * as Diff from 'diff';
import 'diff2html/bundles/css/diff2html.min.css';
import { TrashIcon } from '@heroicons/react/24/solid'

export const recipeLoader = async ({ params }) => {
  const { recipe_id, username } = params;
  const res = await apiReq('get',`/api/recipes/${recipe_id}?owner=${username}`);
  
  if(res.ok || res.status == 401){
    return res.json;
  }

  throw Error('Recipe not found');
};

export default function Recipe(){
  const recipe_data = useLoaderData();
  const { user } = useAuth();
  const is_viewer_owner = user && user.username === recipe_data.owner
  console.log(recipe_data);
  const [isPermissionsOpen, setIsPermissionsOpen] = useState(false);
  return(
    <div className="relative w-screen bg-stone-50 p-8">
      <div className="lg:flex lg:items-center lg:justify-between pb-5">
        <div className="min-w-0 flex-1">
          <h3 className="text-xl hover:text-indigo-800"><Link to={`/${recipe_data.owner}`}>{recipe_data.owner}/</Link></h3>
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">{recipe_data.timeline_items.edits[0].title}</h2>
          <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
            <div className="mt-0 text-sm text-gray-500">Last modified on {recipe_data.last_modified}</div>
            {recipe_data.forked_from && <div className="mt-0 text-sm text-gray-500">Forked from {recipe_data.forked_from}</div>}
            {recipe_data.source_url && <div className="mt-0 text-sm text-gray-500">Adapted from {recipe_data.source_url}</div>}
          </div>
          {user && <button className="px-3 py-1 border-2 border-gray-600 text-gray-600 hover:text-white hover:bg-gray-600 m-1 rounded-lg">Fork</button>}
          {is_viewer_owner && <button className="text-red-700 border-2 border-red-700 hover:bg-red-700 hover:text-white px-3 py-1 m-1 rounded-lg">Delete</button>}
          {is_viewer_owner && <button className="text-indigo-700 border-2 border-indigo-700 hover:bg-indigo-600 hover:text-white px-3 py-1 m-1 rounded-lg" onClick={()=>setIsPermissionsOpen(true)}>Share</button>}
          <Dialog open={isPermissionsOpen} onClose={()=>setIsPermissionsOpen(false)} >
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center">
            <Dialog.Panel className="mx-auto max-w-sm rounded bg-green-200">
              <Dialog.Title>Recipe Permissions</Dialog.Title>
              HELLO
              <form>
                <input type="text"/>
              </form>
            </Dialog.Panel>
            </div>
          </Dialog>
        </div>
      </div>
      <div className="flex flex-wrap">
        <RecipeDetails recipe={recipe_data} is_viewer_owner={is_viewer_owner} />
        <RecipeTimeline recipe={recipe_data} is_viewer_owner={is_viewer_owner} />
      </div>
    </div>
  );
}

const RecipeDetails = ({ recipe, is_viewer_owner }) => {
  const recipe_details = recipe.timeline_items.edits[0]
  const [isEditing, setIsEditing] = useState(false);
  const [recipeEditData, setRecipeEditData] = useState({
    title: recipe_details.title,
    description: recipe_details.description,
    ingredients: recipe_details.ingredients,
    instructions: recipe_details.instructions,
  });
  const handleEditClick = () => {
    setIsEditing(true);
  };
  const handleEditSubmit = (e) => {
    e.preventDefault();
    setIsEditing(false);
    // check that *something* has been changed
    console.log(recipe_details.description == recipeEditData.description)
    console.log(recipe_details.ingredients == recipeEditData.ingredients)
    console.log(recipe_details.instructions == recipeEditData.instructions)
    if(((recipe_details.description === recipeEditData.description) &&
    (recipe_details.ingredients === recipeEditData.ingredients)) &&
    (recipe_details.instructions === recipeEditData.instructions)){
      console.log('Do nothing!');
      return;
    }
    console.log('api call');
    // send API call
  };
  const handleEditChange = (e) => {
    e.target.style.height = 'inherit';
    e.target.style.height = `${e.target.scrollHeight}px`;
    setRecipeEditData( oldData => {
      return {
        ...oldData,
        [e.target.name] : e.target.value
      };
    });
  };

  if(isEditing){
    return(
  <div className="md:w-7/12 w-full px-2 bg-stone-50 pb-16">
      <div className="h-40 bg-red-300">
        <img src="/src/assets/patterns/japanese.png" className="object-cover mix-blend-multiply h-full w-full"/>
      </div>
      <form onSubmit={handleEditSubmit} id="editRecipe">
        <div>
        <h4 className="font-serif text-bold text-xl">Title</h4>
        <textarea className="w-full h-fit" name="title"
        onFocus={(e)=>{e.target.style.height=`${e.target.scrollHeight}px`;}}
        value={recipeEditData.title} onChange={handleEditChange} />
        </div>
        <div>
        <h4 className="font-serif text-bold text-xl">Description</h4>
        <textarea className="w-full h-fit" name="description"
        onFocus={(e)=>{e.target.style.height=`${e.target.scrollHeight}px`;}}
        value={recipeEditData.description} onChange={handleEditChange} />
        </div>
      <div className="w-full p-2">
        <h4 className="font-serif text-bold text-xl"> Ingredients</h4>
        <textarea className="w-full h-fit" name="ingredients" 
        onFocus={(e)=>{e.target.style.height=`${e.target.scrollHeight}px`;}}
        value={recipeEditData.ingredients} onChange={handleEditChange} />
      </div>
      <div className="w-full p-2">
        <h4 className="font-serif text-bold text-xl">Instructions</h4>
        <textarea className="w-full h-fit" name="instructions" 
        onFocus={(e)=>{e.target.style.height=`${e.target.scrollHeight}px`;}}
        value={recipeEditData.instructions} onChange={handleEditChange} />
      </div>
      </form>
        <button className="outline outline-2 outline-gray-400 hover:bg-gray-400 text-bold rounded-lg my-5 mx-2 py-2 px-16"
          onClick={(e)=>{e.preventDefault(); setIsEditing(false);}}>Cancel</button>
        <button type="submit" form="editRecipe" className="bg-lime-500 hover:bg-lime-400 text-bold rounded-lg my-5 mx-2 py-2 px-16">Save</button>
  </div>);
  }else{
  return (
    <div className="md:w-7/12 w-full px-2 bg-stone-50 pb-16">
      <div className="h-40 bg-red-300">
        <img src="/src/assets/patterns/japanese.png" className="object-cover mix-blend-multiply h-full w-full"/>
      </div>
      <div className="relative">
      {is_viewer_owner && <button hidden={isEditing} onClick={handleEditClick} className="absolute p-2 right-0 mx-4 rounded-full text-center outline outline-2 outline-gray-500 hover:bg-gray-500"><PencilIcon className="text-gray-500 w-6 h-6 hover:text-white"/></button>}
      <div className="m-4 whitespace-break-spaces">{recipeEditData.description}</div>
      <div className="w-full p-2">
        <h4 className="font-serif text-bold text-xl"> Ingredients</h4>
        <div className="px-4 mx-4 whitespace-break-spaces">{recipeEditData.ingredients}</div>
      </div>
      <div className="w-full p-2">
        <h4 className="font-serif text-bold text-xl">Instructions</h4>
        <div className="px-4  mx-4 whitespace-pre-wrap">{recipeEditData.instructions}</div>
      </div>
      </div>
    </div>
  );
  }
  // return (
  //   <div className="md:w-7/12 w-full px-2 bg-stone-50 pb-16">
  //     <div className="h-40 bg-red-300">
  //       <img src="/src/assets/patterns/japanese.png" className="object-cover mix-blend-multiply h-full w-full"/>
  //     </div>
  //     <div className="relative">
  //     {is_viewer_owner && <button hidden={isEditing} onClick={handleEditClick} className="absolute p-2 right-0 mx-4 rounded-full text-center outline outline-2 outline-gray-500 hover:bg-gray-500"><PencilIcon className="text-gray-500 w-6 h-6 hover:text-white"/></button>}
  //     <div contentEditable={isEditing} onBlur={handleChange} suppressContentEditableWarning={true} id="description" className="m-4 contentEditable:p-2 whitespace-break-spaces contentEditable:rounded-xl contentEditable:outline contentEditable:outline-2 contentEditable:outline-gray-400">{recipeEditData.description}</div>
  //     <div className="w-full p-2">
  //       <h4 className="font-serif text-bold text-xl"> Ingredients</h4>
  //       <div contentEditable={isEditing} onBlur={handleChange} suppressContentEditableWarning={true} id="ingredients" className="px-4 contentEditable:py-4 mx-4 whitespace-break-spaces contentEditable:rounded-xl contentEditable:outline contentEditable:outline-2 contentEditable:outline-gray-400">{recipeEditData.ingredients}</div>
  //     </div>
  //     <div className="w-full p-2">
  //       <h4 className="font-serif text-bold text-xl">Instructions</h4>
  //       <div contentEditable={isEditing} onBlur={handleChange} suppressContentEditableWarning={true} id="instructions" className="px-4 contentEditable:py-4 mx-4 whitespace-pre-wrap contentEditable:rounded-xl contentEditable:outline contentEditable:outline-2 contentEditable:outline-gray-400">{recipeEditData.instructions}</div>
  //     </div>
  //     {is_viewer_owner && <button hidden={!isEditing} onClick={handleSaveClick} className="bg-lime-500 hover:bg-lime-400 text-bold rounded-lg m-5 py-2 px-16">Save</button>}
  //     </div>
  //   </div>
};

const RecipeTimeline = ({recipe, is_viewer_owner}) => {
  const edits = recipe.timeline_items.edits
  for(let i=0; i<edits.length-1; i++){
    const prev = edits[i+1];
    const curr = edits[i];
    curr.diffHtml = "";
    for(const attr of ['title', 'description', 'ingredients', 'instructions']){
      if(prev[attr]!==curr[attr]){
        const this_diff= Diff.createPatch(attr, prev[attr], curr[attr])
        const this_diff2Html = Diff2Html.html(this_diff, {
          matching: 'lines',
          drawFileList: false,
          srcPrefix: false,
          dstPrefix: false,
          outputFormal: 'line-by-line'
        })
        curr.diffHtml = curr.diffHtml.concat(this_diff2Html);
      }
    }
  }
  // mix together experiment and edits, sort by commit_date
  const items = recipe.timeline_items.experiments.concat(edits.slice(0,-1)).sort((a, b)=>(a.commit_date < b.commit_date)?1:-1);
  const [newExperimentForm, setNewExperimentForm] = useState({
    commit_msg : "",
    notes: "",
  });
  const handleExpChange = (e) => {
    setNewExperimentForm(oldData => {return({...oldData, [e.target.name]: e.target.value});});
  };
  return (
    <div className="md:w-5/12 w-full bg-white p-4">
      <h3 className="text-2xl leading-5 font-bold font-serif">Timeline</h3>
      {is_viewer_owner && 
      <Disclosure>
        <Disclosure.Button className="outline outline-2 outline-lime-500 hover:bg-lime-500 text-bold rounded-lg my-5 mx-2 py-2 px-16">Add experiment</Disclosure.Button>
        <Disclosure.Panel className="flex flex-col bg-stone-100 p-4 pr-6 rounded-lg">
          <form onSubmit={(e)=>e.preventDefault()}>
            <div><input type="text" required placeholder="Commit message" name="commit_msg" value={newExperimentForm.commit_msg} onChange={handleExpChange} className="w-full m-2 p-2" /></div>
            <div><textarea name="notes" placeholder="Notes" value={newExperimentForm.notes} onChange={handleExpChange} className="w-full m-2 p-2"/></div>
            <div className="text-center"><button type="submit" className="bg-lime-500 hover:bg-lime-400 text-bold rounded-lg mx-2 py-1 px-8">Save</button></div>
          </form>
        </Disclosure.Panel>
      </Disclosure>}
      {/* {recipe.timeline_items.experiments.map(experiment => (<Experiment experiment={experiment} key={experiment.id}/>))}
      {recipe.timeline_items.edits.slice(0,-1).map(edit => (<Edit edit={edit} key={edit.id}/>))} */}
      {items.map(item => {
        if(item.item_type==='edit'){return <Edit edit={item} key={`ed${item.id}`} canEdit={recipe.can_edit}/>}
        else if(item.item_type==='experiment'){return <Experiment experiment={item} key={`exp${item.id}`}/>}
      })}
      <Created edit={edits[edits.length-1]}/>
    </div>
  );
}

const Experiment = ({experiment}) => {
  const { user } = useAuth();
  console.log('user',user);
  return (
    // <div>{experiment.commit_date}</div>
  <Disclosure>
    <Disclosure.Button as="div" className="group relative flex flex-col hover:bg-indigo-50">
      { (user && experiment.commit_by === user.id ) && <button className="h-6 w-6 rounded-lg p-1
        absolute top-1/3 right-0 mx-5 hidden 
        group-hover:block border-2 border-red-700 text-red-700
        hover:bg-red-700 hover:text-white" onClick={()=>console.log('delete clicked')}><TrashIcon /></button>}
      <small>{experiment.commit_date}</small><h5 className="text-lg">{experiment.commit_msg}</h5></Disclosure.Button>
    <Disclosure.Panel>{experiment.notes}</Disclosure.Panel>
  </Disclosure>
  );
};

const Created = ({edit}) => {
  return (
    // <div>{experiment.commit_date}</div>
  <Disclosure>
    <Disclosure.Button as="div" className="flex flex-col hover:bg-indigo-50"><small>{edit.commit_date}</small><h5 className="text-lg">Recipe created</h5></Disclosure.Button>
    <Disclosure.Panel>{edit.title}{edit.description}{edit.ingredients}{edit.instructions}</Disclosure.Panel>
  </Disclosure>
  );
};

const Edit = ({edit, canEdit}) => {
  return (
  <Disclosure>
    <Disclosure.Button as="div" className="group relative flex flex-col hover:bg-indigo-50">
      {canEdit && <button className="h-6 w-6 rounded-lg p-1
        absolute top-1/3 right-0 mx-5 hidden 
        group-hover:block border-2 border-red-700 text-red-700
        hover:bg-red-700 hover:text-white"><TrashIcon /></button>}
      <small>{edit.commit_date}</small><h5 className="text-lg">Recipe edited</h5></Disclosure.Button>
    <Disclosure.Panel className="px-4"><div dangerouslySetInnerHTML={{__html: edit.diffHtml}} /></Disclosure.Panel>
  </Disclosure>);
};