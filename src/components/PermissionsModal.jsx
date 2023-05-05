import { useAuth } from '../contexts/AuthProvider';
import { useState, useEffect } from 'react';
import apiReq from '../ApiClient';
import { XMarkIcon, PencilIcon, CheckIcon, PlusIcon } from '@heroicons/react/24/solid';

const convertDropdownToUPermission = (ddValue) => {
    if(ddValue==='viewer'){
        return {can_edit: false, can_experiment: false};
    } else if (ddValue==='experimenter'){
        return {can_edit: false, can_experiment: true};
    } else if (ddValue==='editor'){
        return {can_edit: true, can_experiment: true}
    }
};
const convertUPermissionToDropdown = (permission) => {
    if (!permission.can_edit && !permission.can_experiment){
        return 'viewer';
    } else if (permission.can_edit && permission.can_experiment ){
        return 'editor';
    } else{
        return 'experimenter';
    }
};

const UserPermissionRow = ({userPermission, setUserPermissions, recipeId}) => {
    const [userPermissionDD, setUserPermissionDD] = useState(convertUPermissionToDropdown(userPermission));
    const [isEditing, setIsEditing] = useState(false);
    async function editPermission(e){
        e.preventDefault();
        setIsEditing(false);
        const response = await apiReq('PUT',`/api/recipes/${recipeId}/permissions/${userPermission.user_id}`,'',convertDropdownToUPermission(userPermissionDD));
        if(response.status!==200){
            alert('unsuccessful');
        }
        // convert dd to permission
        // send to server!
    }
    async function deletePermission(e){
        e.preventDefault();
        const response = await apiReq('DELETE', `/api/recipes/${recipeId}/permissions/${userPermission.user_id}`);
        if(response.status===200){
            setUserPermissions(oldData => oldData.filter(d => d.username !== userPermission.username));
        }
    }

    return(
        <tr className="group">
            <td className="w-4"><button className="hidden group-hover:inline" onClick={deletePermission}><XMarkIcon className="w-3 h-3 text-gray-400 hover:text-red-700"/></button></td>
            <td className="pl-2 pr-8 w-52" >{userPermission.username}</td>
            <td className="group/dropdown w-40">
                <select value={userPermissionDD} onChange={(e)=>{setUserPermissionDD(e.target.value)}} disabled={!isEditing} className="disabled:appearance-none disabled:bg-gray-50 bg-white pr-1">
                    <option value="viewer">Viewer</option>
                    <option value="experimenter">Experimenter</option>
                    <option value="editor">Editor</option>
                </select>
            {!isEditing && <button className="hidden group-hover/dropdown:inline" onClick={e=>setIsEditing(true)}><PencilIcon className="w-3 h-3 text-gray-400 hover:text-indigo-700" /></button>}
            {isEditing && <button onClick={editPermission}><CheckIcon className="w-4 h-4 text-gray-600 hover:text-green-700" /></button>}
            </td>
        </tr>
    );
};

const NewPermission = ({userPermissions, setUserPermissions, recipeId}) => {
    const [userPermissionDD, setUserPermissionDD] = useState('viewer');
    const [isAdding, setIsAdding] = useState(false);
    const [usernameField, setUsernameField] = useState("");
    // const handleUsernameFieldChange = (e) => {
    //     setUsernameField(e.target.value);
    // };
    async function addPermission(e){
        if(usernameField.length > 2){
            // check that it isn't already there
            // console.log((userPermissions.some((p)=>{p.username===usernameField})));
            //     return;
            // }
            // send to server!
            const newPermission = {username: usernameField, ...convertDropdownToUPermission(userPermissionDD)};
            const response = await apiReq('POST',`/api/recipes/${recipeId}/permissions`,'',newPermission);
            if(response.status===200){
                setIsAdding(false);
                // if server says ok:
                setUserPermissions(oldData => [...oldData, {...newPermission, user_id:response.json.user_id}]);
            }else if (response.status===404){
                alert('User does not exist');
            }else if (response.status===409){
                alert('User already added.')
            }
        }
    }
    return(
        <tr>
            <td className="w-4 h-9">
                {!isAdding && <button className="" onClick={e=>{e.preventDefault();setIsAdding(true);}}><PlusIcon className="w-3 h-3 text-gray-400 hover:text-indigo-700"/></button>}
                {isAdding && <button className="" onClick={e=>{e.preventDefault();setUsernameField('');setIsAdding(false);}}><XMarkIcon className="w-3 h-3 text-gray-400 hover:text-indigo-700"/></button>}
            </td>
            {isAdding && <><td className="pl-2 pr-8"><input type="text" size="15" className="px-2 py-1" value={usernameField} onChange={(e)=>setUsernameField(e.target.value)} /></td>
            <td className="group/dropdown">
                <select value={userPermissionDD} onChange={(e)=>setUserPermissionDD(e.target.value)} className="bg-white">
                    <option value="viewer">Viewer</option>
                    <option value="experimenter">Experimenter</option>
                    <option value="editor">Editor</option>
                </select>
            <button onClick={addPermission}><CheckIcon className="w-4 h-4 text-gray-600 hover:text-green-700" /></button>
            </td></>}
        </tr>
    );
}

const convertGPermissiontoDropdown = ( permission ) => {
    if ((!permission.is_experiments_public) && (!permission.is_public)){
        return 'private';
    } else if (permission.is_experiments_public && permission.is_public ){
        return 'edits_and_experiments';
    } else{
        return 'edits_only';
    }
};
const convertDropdownToGPermission = ( ddValue ) => {
    if(ddValue==='private'){
        return {is_experiments_public: false, is_public: false};
    } else if (ddValue==='edits_only'){
        return {is_experiments_public: false, is_public: true};
    } else if (ddValue==='edits_and_experiments'){
        return {is_experiments_public: true, is_public: true}
    }
};
const GeneralPermission = ({globalPermission, setGlobalPermission, recipeId}) => {
    const [isGenAccessDisabled, setIsGenAccessDisabled] = useState(true);
    const [globalPermissionDD, setGlobalPermissionDD] = useState(convertGPermissiontoDropdown(globalPermission));
    async function editGlobalPermission(){
        setIsGenAccessDisabled(true);
        // call to api
        const response = await apiReq('PUT',`/api/recipes/${recipeId}/permissions`,'',convertDropdownToGPermission(globalPermissionDD));
        if(response.status!==200){
            alert('Something went wrong');
        }
    }
    return (
        <div className="group pl-8">
            <select value={globalPermissionDD} onChange={e=>setGlobalPermissionDD(e.target.value)} disabled={isGenAccessDisabled} className="disabled:appearance-none mr-2">
            <option value="private">Private</option> 
            <option value="edits_only">Edits public</option> 
            <option value="edits_and_experiments">Edits and experiments public</option> 
        </select>
        {isGenAccessDisabled && <button className="hidden group-hover:inline" onClick={e=>setIsGenAccessDisabled(false)}><PencilIcon className="w-3 h-3 text-gray-400 hover:text-indigo-700" /></button>}
        {!isGenAccessDisabled && <button onClick={editGlobalPermission}><CheckIcon className="w-4 h-4 text-gray-600 hover:text-green-700" /></button>}
        </div>
    );
};

export const PermissionsModal = ({recipeId}) => {
    const [userPermissions, setUserPermissions] = useState([]);
    const [globalPermission, setGlobalPermission] = useState(undefined);
    useEffect(()=>{
        // fetch the permissions
        const getPermissions = async () => {
            const response = await apiReq('GET',`/api/recipes/${recipeId}/permissions`);
            const data = response.json;
            setGlobalPermission({
                is_experiments_public: data.is_experiments_public,
                is_public: data.is_public,
            })
            setUserPermissions(data.shared_with);
        };
        getPermissions();
    }, []);
    return(
    <>
        Users with access
        {/* table of existing users with option to edit */}
        <table className="table-fixed"><tbody>
            {userPermissions.map(userPermission => <UserPermissionRow recipeId={recipeId} userPermission={userPermission} key={userPermission.username} setUserPermissions={setUserPermissions} />)}
            <NewPermission userPermissions={userPermissions} setUserPermissions={setUserPermissions} recipeId={recipeId} />
        </tbody></table>
        General access
        {globalPermission!==undefined && <GeneralPermission globalPermission={globalPermission} setGlobalPermission={setGlobalPermission} recipeId={recipeId} />}
        {/* space here for any notifications... add a timeout? */}
    </>
    );
};