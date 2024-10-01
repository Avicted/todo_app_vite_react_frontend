import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../hooks";
import { useRegisterMutation } from "../../services/AuthenticationAPI";
import { APIError, IUser, register } from "./authenticationSlice";

export default function Register() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [registerRequest] = useRegisterMutation(); // Use register mutation hook
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<string[]>([]);
    const [successfullyRegistered, setSuccessfullyRegistered] = useState(false);

    // Handle input changes for email and password
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'email') {
            setEmail(value);
        } else if (name === 'password') {
            setPassword(value);
        }
    };

    // Handle register new user request
    const handleRegisterRequest = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const user: IUser = await registerRequest({ email, password }).unwrap(); // Unwrap to handle promise rejection
            dispatch(register(user as IUser)); // Dispatch the user data to the store

            console.log('User:', user);

            setErrors([]); // Clear any previous errors
            setSuccessfullyRegistered(true);
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

    useEffect(() => {
        if (successfullyRegistered) {
            console.log('Navigating to login page');
            navigate("/authentication/login");
        }
    }, [successfullyRegistered, navigate]);


    return (
        <>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
                        Register a new account
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form action="#" method="POST" onSubmit={handleRegisterRequest} className="space-y-6">
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
                                onClick={() => setErrors([])}
                                className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                            >
                                Register
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
