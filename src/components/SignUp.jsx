import { Link } from 'react-router-dom'
import { QuestionMarkCircleIcon } from '@heroicons/react/24/solid';
import { Popover } from '@headlessui/react';

export const SignUp = () => {
    return (
        <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <Link to="/"><img className="mx-auto h-10 w-auto" src="/src/assets/fork.png" alt="Forkd."/></Link>
                <h2 className="mt-4 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Sign Up for Forkd.</h2>
            </div>
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-3">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">Username</label>
                        <div className="mt-2">
                            <input id="username" name="username" type="text" required className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6"/>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Email address</label>
                        <div className="mt-2">
                            <input id="email" name="email" type="email" required className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6"/>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Password</label>
                        <div className="mt-2">
                            <input id="password" name="password" type="password" required className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6"/>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="confirm_password" className="block text-sm font-medium leading-6 text-gray-900">Confirm Password</label>
                        <div className="mt-2">
                            <input id="confirm_password" name="confirm_password" type="password" required className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6"/>
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
                    <a className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">Generate a temporary test account.</a>
                    <Popover className="inline">
                    <Popover.Button><QuestionMarkCircleIcon className="inline align-top w-5 h-5 text-gray-400"/></Popover.Button>
                    <Popover.Panel>
                <div className="text-sm text-gray-500">
                    A test account will be generated with a dummy email and username. 
                    It will have <em>most</em> of the functionality of a full account,
                    but will be completely deleted on logout.</div>
                    </Popover.Panel>
                    </Popover>
                </div>
            </div>
        </div>
    );
};
