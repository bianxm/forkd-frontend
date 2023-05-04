import { useLoaderData, Link, useNavigate } from 'react-router-dom'
import apiReq from '../ApiClient'
import { useAuth } from '../contexts/AuthProvider';
import { PencilIcon } from '@heroicons/react/24/solid';
import { useState, useEffect } from 'react';
import { Dialog, Disclosure } from '@headlessui/react';
import * as Diff2Html from 'diff2html';
import * as Diff from 'diff';
import 'diff2html/bundles/css/diff2html.min.css';
import { TrashIcon } from '@heroicons/react/24/solid'
import { useFlash } from '../contexts/FlashProvider';
import { PermissionsModal } from './PermissionsModal';

export const recipeLoader = async ({ params }) => {
  const { recipe_id, username } = params;
  const res = await apiReq('get',`/api/recipes/${recipe_id}?owner=${username}`);

  
  if(res.ok || res.status == 401){
    // loop through timeline items and convert commit_date to Date objects
    const data = res.json;
    for(const item of data.timeline_items.edits){
      item.commit_date = new Date(item.commit_date);
    }
    if(data.timeline_items.experiments){
      for(const item of data.timeline_items.experiments){
        item.commit_date = new Date(item.commit_date);
      }
    }
    return data;
  }

  throw Error('Recipe not found');
};

export default function Recipe(){
  const navigate = useNavigate();
  const recipe_data = useLoaderData();
  const { user } = useAuth();
  const is_viewer_owner = user && user.username === recipe_data.owner
  const [isPermissionsOpen, setIsPermissionsOpen] = useState(false);
  
  const [edits, setEdits] = useState(recipe_data.timeline_items.edits);
  const [experiments, setExperiments] = useState(recipe_data.timeline_items.experiments ? recipe_data.timeline_items.experiments : null);
  
  async function handleFork(e){
    e.preventDefault();
    const response = await apiReq('POST','/api/recipes','',{
      title: recipe_data.timeline_items.edits[0].title,
      description: recipe_data.timeline_items.edits[0].description,
      ingredients: recipe_data.timeline_items.edits[0].ingredients,
      instructions: recipe_data.timeline_items.edits[0].instructions,
      url: recipe_data.source_url,
      forked_from: recipe_data.id
    });
    if(response.status===201){
        navigate(`/${user.username}`);
    }else{
        flash('Cannot extract recipe','bg-red-100 border border-red-400 text-red-700');
    }
  }
  
  async function deleteRecipe(){
    if(confirm('Are you sure you want to delete this recipe? It cannot be undone.')){
      const response = await apiReq('DELETE',`/api/recipes/${recipe_data.id}`)
      if(response.status===200){
        navigate(`/${user.username}`);
      }else {
        flash('Sorry, something went wrong','bg-red-100 border border-red-400 text-red-700');
      }
    }
  }

  return(
    <div className="relative w-screen bg-stone-50 p-8">
      <div className="lg:flex lg:items-center lg:justify-between pb-5">
        <div className="min-w-0 flex-1">
          <h3 className="text-xl hover:text-indigo-800"><Link to={`/${recipe_data.owner}`}><img className="inline w-6 h-6 ml-2 rounded-full" src={recipe_data.owner_avatar ? recipe_data.owner_avatar : '/src/assets/avatars/av4.jpg'} />{` ${recipe_data.owner}`}/</Link></h3>
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">{recipe_data.timeline_items.edits[0].title}</h2>
          <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
            <div className="mt-0 text-sm text-gray-500">Last modified on {recipe_data.last_modified}</div>
            {recipe_data.forked_from && <div className="mt-0 text-sm text-gray-500">Forked from <Link to={`/${recipe_data.forked_from_username}/${recipe_data.forked_from}`} className="hover:text-indigo-700 font-bold">{recipe_data.forked_from_username}/</Link></div>}
            {recipe_data.source_url && <div className="mt-0 text-sm text-gray-500">Adapted from <a href={recipe_data.source_url} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-700">{recipe_data.source_url}</a></div>}
          </div>
          {user && <button onClick={handleFork} className="px-3 py-1 border-2 border-gray-600 text-gray-600 hover:text-white hover:bg-gray-600 m-1 rounded-lg">Fork</button>}
          {is_viewer_owner && <button onClick={deleteRecipe} className="text-red-700 border-2 border-red-700 hover:bg-red-700 hover:text-white px-3 py-1 m-1 rounded-lg">Delete</button>}
          {recipe_data.can_edit && <button className="text-indigo-700 border-2 border-indigo-700 hover:bg-indigo-600 hover:text-white px-3 py-1 m-1 rounded-lg" onClick={()=>setIsPermissionsOpen(true)}>Share</button>}
          <Dialog open={isPermissionsOpen} onClose={()=>setIsPermissionsOpen(false)} >
            <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center">
            <Dialog.Panel className="flex flex-col mx-auto rounded-lg bg-gray-50 p-4">
              <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">{`Share "${recipe_data.timeline_items.edits[0].title}"`}</Dialog.Title>
              <PermissionsModal recipeId={recipe_data.id} />
            </Dialog.Panel>
            </div>
          </Dialog>
        </div>
      </div>
      <div className="flex flex-wrap">
        <RecipeDetails recipe={recipe_data} edits={edits} setEdits={setEdits} />
        <RecipeTimeline recipe={recipe_data} edits={edits} setEdits={setEdits} experiments={experiments} setExperiments={setExperiments} />
      </div>
    </div>
  );
}

const RecipeDetails = ({ recipe, edits, setEdits }) => {
  const flash = useFlash();
  const recipe_details = recipe.timeline_items.edits[0]
  const [isEditing, setIsEditing] = useState(false);
  const [recipeEditData, setRecipeEditData] = useState({
    title: recipe_details.title,
    description: recipe_details.description,
    ingredients: recipe_details.ingredients,
    instructions: recipe_details.instructions,
    img_url: recipe_details.img_url,
  });
  const handleEditClick = () => {
    setIsEditing(true);
  };
  async function handleEditSubmit(e){
    e.preventDefault();
    setIsEditing(false);
    // check that *something* has been changed
    if(recipe_details.title === recipeEditData.title &&
    ((recipe_details.description === recipeEditData.description) &&
    (recipe_details.ingredients === recipeEditData.ingredients)) &&
    (recipe_details.instructions === recipeEditData.instructions)){
      return;
    }
    // send API call
    const response = await apiReq('PUT',`/api/recipes/${recipe.id}`,'', recipeEditData);
    if(response.status===200){
      const json = await response.json;
      const prev = edits[0];
      const curr = recipeEditData;
      let curr_diffHtml = "";
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
          curr_diffHtml = curr_diffHtml.concat(this_diff2Html);
        }
      }
      setEdits(oldData => [{...json, commit_date: new Date(response.json.commit_date),
      diffHtml: curr_diffHtml}, ...oldData]);
      flash('Edit added!','bg-green-100 border border-green-400 text-green-700');
    } else{
      flash('Error adding edit.','bg-red-100 border border-red-400 text-red-700');
    }
  }

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
        <img src={recipeEditData.img_url? recipeEditData.img_url : "/src/assets/patterns/japanese.png"} className="object-cover mix-blend-multiply h-full w-full"/>
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
        <button className="outline outline-2 outline-gray-400 hover:bg-gray-400 text-bold rounded-lg my-1 sm:my-5 mx-2 py-2 px-14"
          onClick={(e)=>{e.preventDefault(); setIsEditing(false);}}>Cancel</button>
        <button type="submit" form="editRecipe" className="bg-lime-500 hover:bg-lime-400 text-bold rounded-lg my-1 sm:my-5 mx-2 py-2 px-16">Save</button>
  </div>);
  }else{
  return (
    <div className="md:w-7/12 w-full px-2 bg-stone-50 pb-16">
      <div className="h-40 bg-red-300">
        <img src={recipeEditData.img_url? recipeEditData.img_url : "/src/assets/patterns/japanese.png"} className="object-cover mix-blend-multiply h-full w-full"/>
      </div>
      <div className="relative">
      {recipe.can_edit && <button hidden={isEditing} onClick={handleEditClick} className="absolute p-2 right-0 mx-4 rounded-full text-center outline outline-2 outline-gray-500 hover:bg-gray-500"><PencilIcon className="text-gray-500 w-6 h-6 hover:text-white"/></button>}
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
};

const RecipeTimeline = ({recipe, edits, setEdits, experiments, setExperiments}) => {
  const flash = useFlash();
  const [recalcDiff, setRecalcDiff] = useState(true);
  useEffect(()=>{
    let newEdits = [];
    for(let i=0; i<edits.length-1; i++){
      const prev = edits[i+1];
      const curr = edits[i];
      let curr_diffHtml = "";
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
          curr_diffHtml = curr_diffHtml.concat(this_diff2Html);
        }
      }
      newEdits.push({...curr, diffHtml: curr_diffHtml});
    }
    setEdits([...newEdits, edits[edits.length-1]]);
  },[recalcDiff]);
  
  // mix together experiment and edits, sort by commit_date
  let items= experiments? experiments.concat(edits.slice(0,-1)).sort((a, b)=>(a.commit_date < b.commit_date)?1:-1) : edits.slice(0,-1);
  const [newExperimentForm, setNewExperimentForm] = useState({
    commit_msg : "",
    notes: "",
  });
  const handleExpChange = (e) => {
    if(e.target.name==='notes'){
      e.target.style.height = 'inherit';
      e.target.style.height = `${e.target.scrollHeight}px`;
    }
    setNewExperimentForm(oldData => {return({...oldData, [e.target.name]: e.target.value});});
  };

  async function submitNewExperiment(e) {
    e.preventDefault();
    const response = await apiReq('POST',`/api/recipes/${recipe.id}`,'', newExperimentForm);
    const json = response.json;
    if(response.status===200){
      setNewExperimentForm({commit_msg:"", notes:""})
      setExperiments(oldData => [{...json, commit_date: new Date(json.commit_date)}, ...oldData]);
      flash('Experiment added!','bg-green-100 border border-green-400 text-green-700');
    } else{
      flash('Error adding experiment.','bg-red-100 border border-red-400 text-red-700')
    }
  }

  return (
    <div className="md:w-5/12 w-full bg-white p-4">
      <h3 className="text-2xl leading-5 font-bold font-serif">Timeline</h3>
      {recipe.can_experiment && 
      <Disclosure>
        <Disclosure.Button className="outline outline-2 outline-lime-500 hover:bg-lime-500 text-bold rounded-lg my-5 mx-2 py-2 px-16">Add experiment</Disclosure.Button>
        <Disclosure.Panel className="flex flex-col bg-stone-100 p-4 pr-6 rounded-lg">
          <form onSubmit={submitNewExperiment}>
            <div><input type="text" required placeholder="Commit message" name="commit_msg" value={newExperimentForm.commit_msg} onChange={handleExpChange} className="w-full m-2 p-2" /></div>
            <div><textarea name="notes" placeholder="Notes" value={newExperimentForm.notes} onChange={handleExpChange} className="w-full m-2 p-2"/></div>
            <div className="text-center"><button type="submit" className="bg-lime-500 hover:bg-lime-400 text-bold rounded-lg mx-2 py-1 px-8">Save</button></div>
          </form>
        </Disclosure.Panel>
      </Disclosure>}
      <ul>
      {items.map(item => {
        if(item.item_type==='edit'){return <Edit edit={item} key={`ed${item.id}`} canEdit={recipe.can_edit} eds={edits} setEds={setEdits} setRecalcDiff={setRecalcDiff} />}
        else if(item.item_type==='experiment'){return <Experiment experiment={item} key={`exp${item.id}`} canExperiment={recipe.can_experiment} canEdit={recipe.can_edit} exps={experiments} setExps={setExperiments}/>}
      })}
      <Created edit={edits[edits.length-1]}/>
      </ul>
    </div>
  );
}

const Experiment = ({experiment, canExperiment, canEdit, exps, setExps }) => {
  const flash = useFlash();
  const { user } = useAuth();

  async function deleteExperiment(e){
    if(confirm("Are you sure you want to delete this experiment? This can't be undone")){
      const response = await apiReq('DELETE', `/api/experiments/${experiment.id}`);
      if(response.status==200){
        setExps(exps.filter(exp => exp.id!==experiment.id));
        flash('Experiment deleted','bg-green-100 border border-green-400 text-green-700');
      }else{
        flash('Something went wrong, sorry','bg-red-100 border border-red-400 text-red-700');
      }
    }
  }

  return (
  <Disclosure as="li" className="relative border-l border-gray-200 pb-10 pl-6">
    <div className="absolute -left-2 top-2 rounded-full w-4 h-4 bg-gray-300"/>
    <Disclosure.Button as="div" className="flex flex-col hover:bg-indigo-50">
      <p><Link className="text-md text-gray-500 hover:text-indigo-600" to={`/${experiment.commit_by}`}><img className="inline w-4 h-4 rounded-full" src={experiment.commit_by_avatar ? experiment.commit_by_avatar : '/src/assets/avatars/av4.jpg'}/> {experiment.commit_by}/</Link></p>
      <h5 className="text-lg font-bold">{experiment.commit_msg}</h5>
      <small>{experiment.commit_date.toLocaleString()}</small>
      </Disclosure.Button>
    <Disclosure.Panel className="p-4 relative rounded-lg bg-slate-50">
      { (canEdit || (canExperiment && (experiment.commit_by===user.username))) && 
      <button className="h-7 w-7 rounded-lg p-1
        absolute top-2 right-0 mx-5 block border-2 border-red-700 text-red-700
        hover:bg-red-700 hover:text-white" onClick={deleteExperiment}><TrashIcon /></button>}
      {experiment.notes ? <p className="text-gray-900">{experiment.notes}</p> : <em className="text-gray-300">no notes</em>}
    </Disclosure.Panel>
  </Disclosure>
  );
};

const Created = ({edit}) => {
  return (
  <Disclosure as="li" className="pl-6 relative">
    <div className="absolute -left-2 top-2 rounded-full w-4 h-4 bg-indigo-400"/>
    <Disclosure.Button as="div" className="flex flex-col hover:bg-indigo-50">
      <p><Link className="text-md text-gray-500 hover:text-indigo-600" to={`/${edit.commit_by}`}><img className="inline w-4 h-4 rounded-full" src={edit.commit_by_avatar ? edit.commit_by_avatar : '/src/assets/avatars/av4.jpg'}/> {edit.commit_by}/</Link></p>
      <h5 className="text-lg font-bold">Recipe created</h5>
      <small>{edit.commit_date.toLocaleString()}</small>
    </Disclosure.Button>
    <Disclosure.Panel className="p-4 relative rounded-lg bg-slate-50">
      <Disclosure>
      <Disclosure.Button as="button" className="mb-2 rounded-lg bg-gray-500 text-white p-2">Show Original Recipe</Disclosure.Button>
      <Disclosure.Panel>
        <h6 className="font-serif font-bold">Title</h6> <p className="mb-2 whitespace-break-spaces">{edit.title}</p>
        <h6 className="font-serif font-bold">Description</h6> <p className="mb-2 whitespace-break-spaces">{edit.description}</p>
        <h6 className="font-serif font-bold">Ingredients</h6><p className="mb-2 whitespace-break-spaces">{edit.ingredients}</p>
        <h6 className="font-serif font-bold">Instructions</h6><p className="whitespace-break-spaces">{edit.instructions}</p>
      </Disclosure.Panel>
      </Disclosure>
      </Disclosure.Panel>
  </Disclosure>
  );
};

const Edit = ({edit, canEdit, eds, setEds, setRecalcDiff}) => {
  const flash = useFlash();
  async function deleteEdit(e){
    if(confirm("Are you sure you want to delete this edit? This can't be undone")){
      const response = await apiReq('DELETE', `/api/edits/${edit.id}`);
      if(response.status==200){
        setEds(eds.filter(ed => ed.id!==edit.id));
        setRecalcDiff(oldData => !oldData);
        flash('Edit deleted','bg-green-100 border border-green-400 text-green-700');
      }else{
        flash('Something went wrong, sorry','bg-red-100 border border-red-400 text-red-700');
      }
    }
  }
  return (
  <Disclosure as="li" className="relative pb-10 pl-6 border-l border-gray-200">
    <div className="absolute -left-2 top-2 rounded-full w-4 h-4 bg-rose-200"/>
    <Disclosure.Button as="div" className="group relative flex flex-col hover:bg-indigo-50">
      <p><Link className="text-md text-gray-500 hover:text-indigo-600" to={`/${edit.commit_by}`}><img className="inline w-4 h-4 rounded-full" src={edit.commit_by_avatar ? edit.commit_by_avatar : '/src/assets/avatars/av4.jpg'}/> {edit.commit_by}/</Link></p>
      <h5 className="text-lg font-bold">Recipe edited</h5>
      <small>{edit.commit_date.toLocaleString()}</small>
      </Disclosure.Button>
    <Disclosure.Panel className="p-4 relative rounded-lg bg-slate-50">
      { canEdit && <button className="h-7 w-7 rounded-lg p-1
        absolute top-2 right-0 mx-5 block border-2 border-red-700 text-red-700
        hover:bg-red-700 hover:text-white" onClick={deleteEdit}><TrashIcon /></button>}
      <div dangerouslySetInnerHTML={{__html: edit.diffHtml}} />
    </Disclosure.Panel>
  </Disclosure>);
};