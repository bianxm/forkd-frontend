 import { createContext, useContext, useState, useEffect } from "react";
 import apiReq from "../ApiClient";
 
 const AuthContext = createContext();

 export default function AuthProvider({ children }){
    const [user, setUser] = useState();

    useEffect(()=>{
        (async () => {
            console.log('effect is running!')
            if(localStorage.getItem('accessToken')){
                const response = await apiReq('GET', '/api/me');
                console.log('response =', response);
                setUser(response.ok ? response.json : null);
            } else{
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
            return userResponse.json;
        }
        if(response.status === '403') return 'fail';
        else return 'error';
    }

    const logout = async () => {
        console.log('logout');
        response = await apiReq('DELETE', '/api/tokens');
        console.log(response);
        // setUser(null);
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