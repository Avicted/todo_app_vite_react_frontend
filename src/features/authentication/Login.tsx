import { useState } from "react";
import { useAppDispatch } from "../../hooks";
import { APIError, IUser, login } from "./authenticationSlice";
import { useLoginMutation } from "../../services/AuthenticationAPI";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [loginRequest] = useLoginMutation(); // Use login mutation hook
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<string[]>([]);

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

        try {
            const user: IUser = await loginRequest({ email, password }).unwrap(); // Unwrap to handle promise rejection
            // dispatch(login(user as IUser)); // Dispatch the user data to the store

            dispatch(login({
                accessToken: user.accessToken, refreshToken: user.refreshToken,
                id: user.id,
                email: user.email,
                tokenType: user.tokenType,
                expiresIn: user.expiresIn
            }));

            console.log('User:', user);

            navigate("/")
        } catch (err) {
            if (err && typeof err === 'object' && 'data' in err) {
                const apiError: APIError = err as APIError;
                console.error('Login request failed:', apiError);

                // Access the errors field within the data object
                if (apiError.data.errors) {
                    for (const [key, messages] of Object.entries(apiError.data.errors)) {
                        messages.forEach(message => {
                            console.error(`${key}: ${message}`)

                            // Add the error message to the errors state
                            setErrors([...errors, `${key}: ${message}`]);
                        });
                    }
                } else {
                    console.error(`Error ${apiError.data.status}: ${apiError.data.title}`);
                }
            } else {
                console.error('Unexpected error:', err);
            }
        }
    };

    return (
        <>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <img
                        alt="Your Company"
                        src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                        className="mx-auto h-10 w-auto"
                    />
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
                                <div className="text-sm">
                                    <a href="#" className="font-semibold text-indigo-400 hover:text-indigo-300">
                                        Forgot password?
                                    </a>
                                </div>
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
