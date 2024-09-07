import { Link } from "react-router-dom"

export const HomePage = () => {
    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
                <h1 className="text-4xl font-bold text-center mt-8">Welcome to the homepage</h1>

                {/* two buttons for User Registration and Login -> Authentication page has both forms  */}
                <div className="flex justify-center mt-8">
                    <Link to="/authentication/register" className="bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-4 rounded mr-4">Register</Link>
                    <Link to="/authentication/login" className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded">Login</Link></div>
            </div>
        </div>
    )
}