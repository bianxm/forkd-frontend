import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react';
import { useAuth } from '../contexts/AuthProvider';

export const LogIn = () => {
    const location = useLocation();
    const hasPreviousState = location.key !== "default";
    const { login } = useAuth();
    const navigate = useNavigate();
    const [loginData, setLoginData] = useState({
        login : "",
        password: "",
    });

    const handleChange = (e) => {
        setLoginData( oldData => {
            return {
                ...oldData,
                [e.target.name] : e.target.value
            };
        } );
    };

    async function handleSubmit(e){
        e.preventDefault();
        const result = await login(loginData.login, loginData.password);
        if(result !== 'error' && result !== 'fail'){
            if(hasPreviousState) navigate(-1);
            else navigate(`/${result.username}`);
        }
    };

    return (
        <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <Link to="/"><img className="mx-auto h-10 w-auto" src="/src/assets/fork.png" alt="Forkd."/></Link>
                <h2 className="mt-4 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Log in to your account</h2>
            </div>
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="login" className="block text-sm font-medium leading-6 text-gray-900">Username or email address</label>
                        <div className="mt-2">
                            <input value={loginData.login} onChange={handleChange}
                            id="login" name="login" type="text" required 
                            className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6"/>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Password</label>
                        <div className="mt-2">
                            <input value={loginData.password} onChange={handleChange}
                            id="password" name="password" type="password" required 
                            className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6"/>
                        </div>
                    </div>
                    <div>
                        <button type="submit" className="flex w-full justify-center rounded-md bg-rose-300 px-3 py-1.5 text-sm font-semibold leading-6 text-rose-950 shadow-sm hover:bg-rose-200 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Log in</button>
                    </div>
                </form>
                <p className="mt-10 text-center text-sm text-gray-500">Not yet a member?{' '}
                    <Link to="/signup" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">Sign up here.</Link>
                </p>
            </div>
        </div>
    );
};