import Register from "./Register";
import Login from "./Login";


export default function AuthenticationPage() {

    return (
        <div>
            {window.location.pathname === "/authentication/login" ? (
                // Render the login form
                <Login />

            ) : (
                // Render the registration form
                <Register />
            )}
        </div>
    )
}
