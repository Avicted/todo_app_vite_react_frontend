import { Outlet } from "react-router-dom";
import { SuccessfullyRegistered } from "./authenticationSlice";
import { useSelector } from "react-redux";


export default function AuthenticationPage() {
    const successfullyRegistered = useSelector(SuccessfullyRegistered);

    return (
        <div>
            {successfullyRegistered && <div className="flex items-center gap-x-6 bg-green-500 px-6 py-2.5 sm:px-3.5 sm:before:flex-1">
                <p className="text-md leading-6 text-white text-center">
                    <strong className="font-semibold">Successfully Registered !</strong>
                </p>
            </div>}

            {/* Render the nested routes Register and Login */}
            <Outlet />
        </div>
    )
}
