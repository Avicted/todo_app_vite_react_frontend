import { Link } from "react-router-dom"
import { useAppSelector } from "../../hooks";

export const HomePage = () => {
    const user = useAppSelector((state) => state.authentication.user);

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
                {!user && (
                    <>
                        <h1 className="text-4xl font-bold text-center mt-8">Welcome to the homepage</h1>
                        <div className="flex justify-center mt-8">
                            <Link to="/authentication/register" className="bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-4 rounded mr-4">Register</Link>
                            <Link to="/authentication/login" className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded">Login</Link></div>
                    </>
                )}

                {user && (
                    <>
                        <h1 className="text-4xl font-bold text-center mt-8">Welcome back, {user.email}</h1>
                    </>
                )}

            </div>
        </div>
    )
}