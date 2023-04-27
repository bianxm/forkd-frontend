import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/solid';
import { Disclosure } from '@headlessui/react';
import { useFlash } from '../contexts/FlashProvider';
import { useAuth } from '../contexts/AuthProvider';

export const SignUp = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [signupData, setSignupData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const flash = useFlash();

    const handleChange = (e) => {
        // console.log(`${e.target.name}: ${e.target.value}`);
        setSignupData( oldData => {
            return {
                ...oldData,
                [e.target.name] : e.target.value
            };
        });
        e.target.setCustomValidity('');
        if(e.target.name === 'confirmPassword'){
            if(signupData.password !== e.target.value){
                e.target.setCustomValidity("Passwords must match");
                e.target.classList.add('outline', 'outline-2', 'outline-red-700');
            }
            if(signupData.password === e.target.value){
                // console.log('im here');
                e.target.classList.remove('outline', 'outline-2', 'outline-red-700');
            }
        }
    };

    async function handleSubmit(e){
        e.preventDefault();
        // console.log(signupData);
        const response = await fetch('/api/users', {
            method: 'POST',
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify({
                email: signupData.email,
                username: signupData.username,
                password: signupData.password
            })
        });
        if(response.status===201){
            // flash message successfully signed up
            flash("Account created!",'bg-green-100 border border-green-400 text-green-700');
            navigate("/login");
        }else{
            const r = await response.json();
            // console.log(r, r.message)
            // alert(r.message); // flash this!
            flash(r.message,'bg-red-100 border border-red-400 text-red-700');
        }
    }

    async function createTempAccount(e){
        let now = 0;
        console.log(now);
        let response = {status: 500};
        do {
            now = Date.now();
            response = await fetch('/api/users', {
                method: 'POST',
                headers: {"Content-Type":"application/json"},
                body: JSON.stringify({
                    email: now.toString(),
                    username: now.toString(),
                    password: now.toString(),
                    is_temp_user: true
                })
            });
        }while(response.status!==201);

        const result = await login(now, now);
        if(!(result==='error' || result==='fail')){
            console.log(result);
            navigate(`/${now}`);
        }
    }

    return (
        <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <Link to="/"><img className="mx-auto h-10 w-auto" src="/src/assets/fork.png" alt="Forkd."/></Link>
                <h2 className="mt-4 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Sign Up for Forkd.</h2>
            </div>
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-3" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">Username</label>
                        <div className="mt-2">
                            <input value={signupData.username} onChange={handleChange} 
                            // title="Username may only contain letters, numbers, hyphens (-), and underscores (_)."
                            onInvalid={e=>{e.target.setCustomValidity("Username must be within 3-20 characters, and may only contain letters, numbers, hyphens, and underscores")}}
                            id="username" name="username" type="text" required pattern="[A-Za-z0-9_\-]+" minLength={3} maxLength={20}
                            className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6"/>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Email address</label>
                        <div className="mt-2">
                            <input value={signupData.email} onChange={handleChange}
                            id="email" name="email" type="email" required 
                            className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6"/>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Password</label>
                        <div className="mt-2">
                            <input value={signupData.password} onChange={handleChange}
                            id="password" name="password" type="password" required 
                            className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6"/>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium leading-6 text-gray-900">Confirm Password</label>
                        <div className="mt-2">
                            <input value={signupData.confirmPassword} onChange={handleChange}
                            onInvalid={e=>{e.target.setCustomValidity("Passwords must match.")}}
                            id="confirmPassword" name="confirmPassword" type="password" required 
                            className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6"/>
                        </div>
                    </div>
                    <div>
                        <button type="submit" className="flex w-full justify-center rounded-md bg-rose-300 px-3 py-1.5 text-sm font-semibold leading-6 text-rose-950 shadow-sm hover:bg-rose-200 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Sign up</button>
                    </div>
                </form>
                <p className="mt-10 text-center text-sm text-gray-500">Already have an account?{' '}
                    <Link to="/login" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">Log in here.</Link>
                </p>
                <div className="text-center text-sm text-gray-500">Can't commit to an account quite yet?{' '}
                    <button onClick={createTempAccount} className="inline font-semibold leading-6 text-indigo-600 hover:text-indigo-500">Use a temporary test account.</button>
                    <Disclosure>
                    <Disclosure.Button><QuestionMarkCircleIcon className="inline align-top w-5 h-5 text-gray-400"/></Disclosure.Button>
                    <Disclosure.Panel>
                <div className="text-sm text-gray-500">
                    A test account will be generated with a dummy email and username. 
                    It will have <em>most</em> of the functionality of a full account,
                    but will be completely deleted on logout.</div>
                    </Disclosure.Panel>
                    </Disclosure>
                </div>
            </div>
        </div>
    );
};
