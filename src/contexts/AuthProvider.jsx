 import { createContext, useContext, useState, useEffect } from "react";
 import apiReq from "../ApiClient";
import { useFlash } from '../contexts/FlashProvider';
 
 const AuthContext = createContext();

 export default function AuthProvider({ children }){
    const [user, setUser] = useState();
    const flash = useFlash();

    useEffect(()=>{
        (async () => {
            // console.log('effect is running!')
            if(localStorage.getItem('accessToken')){
                const response = await apiReq('GET', '/api/me');
                // setUser(response.ok ? response.json : null);
                if(response.ok){
                    setUser(response.json)
                } else{
                    localStorage.removeItem('accessToken');
                    setUser(null);
                }
            }else{
                setUser(null);
            }
        })();
    }, []);

    const login = async (login, password) => {
        const response = await fetch("/api/tokens", {
            method: "POST",
            headers: {
                Authorization: `Basic ${btoa(login+":"+password)}`
            }
        });
        if(response.ok){
            const json = await response.json();
            localStorage.setItem('accessToken', json.token)
            const userResponse = await apiReq('GET', '/api/me');
            setUser(userResponse.ok ? userResponse.json : null)
            flash("Logged in",'bg-green-100 border border-green-400 text-green-700');
            return userResponse.json;
        }
        if(response.status === '403') return 'fail';
        else return 'error';
    }

    const logout = async () => {
        response = await apiReq('DELETE', '/api/tokens');
        setUser(null);
        localStorage.removeItem('accessToken');
    };

    return(
        <AuthContext.Provider value={{user, setUser, login, logout}}>
            { user!==undefined? children : <div>LOADING</div> }
        </AuthContext.Provider>
    );
 }

 export function useAuth(){
    return useContext(AuthContext);
 }