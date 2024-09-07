import Register from "./Register";
import Login from "./Login";
import { Outlet } from "react-router-dom";


export default function AuthenticationPage() {

    return (
        <div>
            {/* Render the nested routes Register and Login */}
            <Outlet />
        </div>
    )
}
