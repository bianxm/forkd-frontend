import { Outlet, NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthProvider";
import { useState } from "react";
import { RadioGroup } from "@headlessui/react";
import apiReq from "../ApiClient";
import { useFlash } from "../contexts/FlashProvider";

export default function Settings(){
    const navlinkStyle = '[&.active]:bg-gray-200 rounded-xl py-1 px-2';
    return (
        <div className="flex flex-col h-full">
        <div className="flex flex-wrap bg-red-300 px-2 py-4 sm:px-8">
            <NavLink to="avatar" className={navlinkStyle}>Change Avatar</NavLink>
            <NavLink to="username" className={navlinkStyle}>Change Username</NavLink>
            <NavLink to="password" className={navlinkStyle}>Change Password</NavLink>
            <NavLink to="email" className={navlinkStyle}>Change Email</NavLink>
        </div>
        <Outlet />
        </div>
    );
}

export function ChangeAvatar(){
    const { user, setUser } = useAuth();
    const flash = useFlash();
    let currentAv = user.img_url ? user.img_url : 'av4';
    let usingDefault = false;
    if(currentAv && currentAv.startsWith('/src/assets/avatars/')){
        usingDefault = true;
        currentAv = currentAv.substring(20,23);
    }
    const avatars = ['av1', 'av2', 'av3', 'av4', 'av5'];
    const [chosenAv, setChosenAv] = useState(currentAv);
    const [selectedFile, setSelectedFile] = useState(null);
    
    const submitChosenAv = async () => {
        let response = null;
        if(chosenAv!=='upload'){
            response = await apiReq('PATCH',`/api/users/${user.id}`,'',{
                img_url: `/src/assets/avatars/${chosenAv}.jpg`
            });
            if(response.status===200){
                setUser(oldData => ({...oldData, img_url: `/src/assets/avatars/${chosenAv}.jpg`,}));
                flash('Avatar changed!','bg-green-100 border border-green-400 text-green-700');
            }
        }else if(chosenAv==='upload') {
            const formData = new FormData();
            formData.append('img_file', selectedFile);
            response = await apiReq('PATCH',`/api/users/${user.id}`,'', formData, {'Content-Type':'multipart/form-data'});
            if(response.status===200){
                setUser(oldData => ({...oldData, img_url: response.json.new_avatar}));
                flash('Avatar changed!','bg-green-100 border border-green-400 text-green-700');
            }else{
                flash('Something went wrong...','bg-red-100 border border-red-400 text-red-700');
            }
        }
    };
    
    return(
        <div className="p-4">
            <h3 className="font-serif text-gray-900 text-lg">Choose your avatar</h3>
            <RadioGroup value={chosenAv} onChange={setChosenAv} className="flex flex-row flex-wrap">
                {avatars.map(av =>(
                    <RadioGroup.Option key={av} value={av}>
                        <div className="p-4 w-fit h-fit ui-checked:bg-lime-200">
                            <img className ="w-16 h-16 md:w-32 md:h-32" src={`/src/assets/avatars/${av}.jpg`} />
                        </div>
                    </RadioGroup.Option>
                ))}
                <RadioGroup.Option value='upload' className="flex flex-col justify-center items-center p-2 w-60 h-24 md:w-64 md:h-40 ui-checked:bg-lime-200">
                <label>Upload your own</label>
                <input className="w-full break-all" type="file" accept="image/*" onChange={(e)=>setSelectedFile(e.target.files[0])} />
                </RadioGroup.Option>
            </RadioGroup>
            <button className="rounded-lg bg-lime-500 hover:bg-lime-400 py-2 px-16 mt-4" onClick={submitChosenAv}>Set Avatar</button>
        </div>
    );
}
export function ChangeUsername(){
    const { user, setUser } = useAuth();
    const flash = useFlash();
    const [ newUsername, setNewUsername ] = useState('');
    const submitNewUsername = async (e) => {
        e.preventDefault();
        const response = await apiReq('PATCH',`/api/users/${user.id}`,'',{
            new_username: newUsername
        });
        if(response.status===200){
            setUser(oldData => ({...oldData, username: newUsername,}));
            flash('Username changed!','bg-green-100 border border-green-400 text-green-700');
        }else{
            flash('Something went wrong, username unchanged','bg-red-100 border border-red-400 text-red-700');
        }
    };
    return(<div className="p-4">
        <form onSubmit={submitNewUsername}>
            <label htmlFor="new_username" className="block text-sm font-medium leading-6 text-gray-900">New username</label>
            <input placeholder={user.username} id="new_username" type="text" value={newUsername} onChange={(e)=>setNewUsername(e.target.value)}
                className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6"
                required pattern="[A-Za-z0-9_\-]+" minLength={3} maxLength={20} />
            <button type="submit" className="rounded-lg bg-lime-500 hover:bg-lime-400 py-2 px-16 mt-4">Submit</button>
        </form>
    </div>);
}
export function ChangePassword(){
    const { user } = useAuth();
    const flash = useFlash();
    const [ oldPassword, setOldPassword ] = useState('');
    const [ newPassword, setNewPassword ] = useState('');
    const [ confirmPassword, setConfirmPassword ] = useState('');

    const handleConfirmPWChange = (e) => {
        setConfirmPassword(e.target.value);
        e.target.setCustomValidity('');
        if(e.target.value!==newPassword){
            e.target.setCustomValidity("Passwords must match")
            e.target.classList.add('outline', 'outline-2', 'outline-red-700');
        }
        if(newPassword === e.target.value){
            e.target.classList.remove('outline', 'outline-2', 'outline-red-700');
        }
    };
    
    const submitChangePassword = async (e) => {
        e.preventDefault();
        const response = await apiReq('PATCH',`/api/users/${user.id}`,'',{
            password: oldPassword,
            new_password: newPassword, 
        });
        if(response.status===200){
            flash('Password changed!','bg-green-100 border border-green-400 text-green-700');
        }else{
            flash('Error changing password. Make sure your old password is correct.','bg-red-100 border border-red-400 text-red-700');
        }
    };
    return(<div className="p-4">
        <form onSubmit={submitChangePassword}>
            <label htmlFor="old_password" className="block text-sm font-medium leading-6 text-gray-900">Old Password</label>
            <input type="password" id="old_password"
            className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6"
            required value={oldPassword} onChange={(e)=>setOldPassword(e.target.value)} />
            <label htmlFor="new_password" className="block text-sm font-medium leading-6 text-gray-900">New Password</label>
            <input type="password" id="new_password"
            className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6"
            required value={newPassword} onChange={(e)=>setNewPassword(e.target.value)} />
            <label htmlFor="confirm_new_password" className="block text-sm font-medium leading-6 text-gray-900">Confirm New Password</label>
            <input type="password" id="confirm_new_password"
            className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6"
            required value={confirmPassword} onChange={handleConfirmPWChange} />
            <button type="submit" className="rounded-lg bg-lime-500 hover:bg-lime-400 py-2 px-16 mt-4">Submit</button>
        </form>
    </div>);
}
export function ChangeEmail(){
    const flash = useFlash();
    const { user } = useAuth();
    const [ newEmail, setNewEmail ] = useState('');
    const submitNewEmail = async (e) => {
        e.preventDefault();
        const response = await apiReq('PATCH',`/api/users/${user.id}`,'',{
            new_email: newEmail
        });
        if(response.status===200){
            flash('Email changed!','bg-green-100 border border-green-400 text-green-700');
        }else if(response.status===409){
            flash('Email already taken. Please use a different email.','bg-red-100 border border-red-400 text-red-700');
        }
    };
    return(<div className="p-4">
        <form onSubmit={submitNewEmail}>
            <label htmlFor="new_email" className="block text-sm font-medium leading-6 text-gray-900">New email</label>
            <input placeholder={user.email} className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6"
            id="new_email" type="email" value={newEmail} onChange={(e)=>setNewEmail(e.target.value)} />
            <button type="submit" className="rounded-lg bg-lime-500 hover:bg-lime-400 py-2 px-16 mt-4">Submit</button>
        </form>
    </div>);
}