import { useAuth } from '../contexts/AuthProvider';
import { useState, useEffect } from 'react';
import apiReq from '../ApiClient';

export const PermissionsModal = ({recipeId}) => {
    const [isGenAccessDisabled, setIsGenAccessDisabled] = useState(true);
    const [userPermissions, setUserPermissions] = useState(undefined);
    const [globalPermission, setGlobalPermission] = useState({
        is_experiments_public: undefined,
        is_public: undefined
    });
    useEffect(()=>{
        // fetch the permissions
        const getPermissions = async () => {
            const response = await apiReq('GET',`/api/recipes/${recipeId}/permissions`);
            const data = response.json;
            console.log('Permissions!',data);
            setGlobalPermission({
                is_experiments_public: data.is_experiments_public,
                is_public: data.is_public,
            })
            setUserPermissions(data.shared_with);
        };
        getPermissions();
    }, []);
    console.log(globalPermission);
    console.log(userPermissions);
    return(
    <>
        <form> 
            Users with access
            {/* table of existing users with option to edit */}
            {/* add a new user here */}
        </form>
        <form>
            General access
            <select disabled={isGenAccessDisabled} className="disabled:appearance-none">
               <option>Private</option> 
               <option>Edits public</option> 
               <option>Edits and experiments public</option> 
            </select>
            <button>Submit</button>
        </form>
        {/* space here for any notifications... add a timeout? */}
    </>
    );
};