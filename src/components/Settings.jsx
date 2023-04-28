import { Outlet, NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthProvider";
import { useState } from "react";
import { RadioGroup } from "@headlessui/react";
import apiReq from "../ApiClient";
import { useFlash } from "../contexts/FlashProvider";

export default function Settings(){
    const { user } = useAuth();
    return (
        <div className="flex flex-row h-full">
        <div className="flex-[1-0-10%] bg-red-300 px-2 py-4 sm:px-8">
            <ul>
                <li><NavLink to="avatar" className={'[&.active]:bg-gray-200'}>Change Avatar</NavLink></li>
                <li><NavLink to="username" className={'[&.active]:bg-gray-200'}>Change Username</NavLink></li>
                <li><NavLink to="password" className={'[&.active]:bg-gray-200'}>Change Password</NavLink></li>
                <li><NavLink to="email" className={'[&.active]:bg-gray-200'}>Change Email</NavLink></li>
            </ul>
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
            console.log('im here!')
            const formData = new FormData();
            formData.append('img_file', selectedFile);
            formData.append('hi','there');
            for(const key of formData.entries()){
                console.log(key)
            }
            response = await apiReq('PATCH',`/api/users/${user.id}`,'', formData, {'Content-Type':'multipart/form-data'});
            if(response.status===200){
                setUser(oldData => ({...oldData, img_url: response.json.new_avatar}));
                flash('Avatar changed!','bg-green-100 border border-green-400 text-green-700');
            }else{
                flash('Something went wrong...','bg-red-100 border border-red-400 text-red-700');
            }
        }
    };
    
    const submitFile = async () => {
    };

    return(
        <div>
            Change Avatar!
            <RadioGroup value={chosenAv} onChange={setChosenAv} className="flex flex-row flex-wrap">
                {avatars.map(av =>(
                    <RadioGroup.Option key={av} value={av}>
                        <div className="p-4 w-fit h-fit ui-checked:bg-green-200">
                            <img className ="w-16 h-16 md:w-32 md:h-32" src={`/src/assets/avatars/${av}.jpg`} />
                        </div>
                    </RadioGroup.Option>
                ))}
                <RadioGroup.Option value='upload' className="w-24 h-24 md:w-40 md:h-40 ui-checked:bg-green-200">Upload your own
                <input type="file" accept="image/*" onChange={(e)=>setSelectedFile(e.target.files[0])} />
                {/* <button type="submit">Hi</button> */}
                </RadioGroup.Option>
            </RadioGroup>
            <button onClick={()=>{console.log(chosenAv);submitChosenAv();}}>Chosen</button>
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
    return(<div>
        <form onSubmit={submitNewUsername}>
            <input type="text" value={newUsername} onChange={(e)=>setNewUsername(e.target.value)}
                required pattern="[A-Za-z0-9_\-]+" minLength={3} maxLength={20} />
            <button type="submit" >Submit</button>
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
        console.log(e.target.value, newPassword);
        console.log(e.target.value===newPassword)
        e.target.setCustomValidity('');
        if(e.target.value!==newPassword){
            e.target.setCustomValidity("Passwords must match")
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
    return(<div>
        <form onSubmit={submitChangePassword}>
            <input type="password" required value={oldPassword} onChange={(e)=>setOldPassword(e.target.value)} />
            <input type="password" required value={newPassword} onChange={(e)=>setNewPassword(e.target.value)} />
            <input type="password" required value={confirmPassword} onChange={handleConfirmPWChange} />
            <button type="submit" >Submit</button>
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
    return(<div>
        <form onSubmit={submitNewEmail}>
            <input type="email" value={newEmail} onChange={(e)=>setNewEmail(e.target.value)} />
            <button type="submit" >Submit</button>
        </form>
    </div>);
}