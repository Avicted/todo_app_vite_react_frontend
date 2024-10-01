import { useEffect, useState } from "react";
import { useAppDispatch } from "../../hooks";
import { APIError, IUser, login, setUserInformation } from "./authenticationSlice";
import { authenticationAPI, useGetOwnDetailsQuery, useLoginMutation } from "../../services/AuthenticationAPI";
import { useNavigate } from "react-router-dom";
import { todoAPI } from "../../services/TodoAPI";
import { persistor } from "../../store";

export default function Login() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<string[]>([]);
    const [loginRequest] = useLoginMutation();

    const { data: userDetails, refetch: refetchUserDetails, isUninitialized } = useGetOwnDetailsQuery(null, {
        skip: !localStorage.getItem('accessToken'), // Skip unless accessToken is available
    });

    // Handle input changes for email and password
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'email') {
            setEmail(value);
        } else if (name === 'password') {
            setPassword(value);
        }
    };

    // Handle login request
    const handleLoginRequest = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrors([]); // Clear previous errors

        try {
            const user: IUser = await loginRequest({ email, password }).unwrap();

            localStorage.setItem('accessToken', user.accessToken as string);

            // Manually invalidate and reset cache for user details and the todo list
            dispatch(authenticationAPI.util.resetApiState());
            dispatch(todoAPI.util.resetApiState());

            // Clear specific persisted data
            const stateToClear = ['user', 'todos']; // Adjust according to your slices
            stateToClear.forEach(key => {
                localStorage.removeItem(`persist:${key}`);
            });

            persistor.purge(); // Clear the persisted state

            dispatch(login({
                id: user.id,
                accessToken: user.accessToken,
                refreshToken: user.refreshToken,
                email: user.email,
                tokenType: "Bearer",
            }));

            console.log({ 'setUserInformation': { id: user.id, email: user.email } })

            dispatch(setUserInformation({ id: user.id, email: user.email }));

            if (!isUninitialized) refetchUserDetails(); // Ensure it fetches fresh user data

            console.log('User logged in:', user);
            navigate('/'); // Navigate to home after login
        } catch (err) {
            if (err && typeof err === 'object' && 'data' in err) {
                const apiError: APIError = err as APIError;
                console.error('Login request failed:', apiError);
                setErrors(["Wrong email or password"]);
            } else {
                console.error('Unexpected error:', err);
            }
        }
    };

    useEffect(() => {
        if (userDetails) {
            // Dispatch user details to Redux
            dispatch(setUserInformation(userDetails));
            console.log('User details:', userDetails);
        }
    }, [userDetails, isUninitialized, dispatch]);

    return (
        <>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
                        Sign in to your account
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form action="#" method="POST" onSubmit={handleLoginRequest} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-white">
                                Email address
                            </label>
                            <div className="mt-2">
                                <input
                                    onChange={handleChange}
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    autoComplete="email"
                                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm font-medium leading-6 text-white">
                                    Password
                                </label>
                                {/*<div className="text-sm">
                                    <a href="#" className="font-semibold text-indigo-400 hover:text-indigo-300">
                                        Forgot password?
                                    </a>
                                </div>*/}
                            </div>
                            <div className="mt-2">
                                <input
                                    onChange={handleChange}
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    autoComplete="current-password"
                                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                            >
                                Sign in
                            </button>
                        </div>
                    </form>
                    <div className="mt-4">
                        {errors.length > 0 && (
                            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
                                <p className="font-bold">There were some errors with your submission</p>
                                <ul>
                                    {errors.map((error, index) => (
                                        <li key={index}>{error}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}
