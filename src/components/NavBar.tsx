import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAppSelector, useAppDispatch } from '../hooks';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { persistor } from '../store';
import { useEffect, useState } from 'react';
import { authenticationAPI } from '../services/AuthenticationAPI';
import { todoAPI } from '../services/TodoAPI';
import { logout } from '../features/authentication/authenticationSlice';



const userNavigation = [
    { name: 'Logout', href: '#' },
];

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}

export default function NavBar() {
    const user = useAppSelector((state) => state.authentication.user);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const [navigation, setNavigation] = useState([
        { name: 'Home', href: '/', current: true },
        { name: 'Todos', href: '/todos', current: false, requiresAuth: true },
        { name: 'Login', href: '/authentication/login', current: false, requiresAuth: false },
        { name: 'Register', href: '/authentication/register', current: false, requiresAuth: false },
    ])

    const handleLogout = async () => {
        console.log("Logging out user");

        // Manually invalidate and reset cache for user details and the todo list
        dispatch(authenticationAPI.util.resetApiState());
        dispatch(todoAPI.util.resetApiState());

        // Clear specific persisted data
        const stateToClear = ['user', 'todos']; // Adjust according to your slices
        stateToClear.forEach(key => {
            localStorage.removeItem(`persist:${key}`);
        });

        persistor.purge(); // Clear the persisted state
        console.log("after dispatch logout");

        dispatch(logout());

        navigate('/authentication/login');
    };

    const filteredNavigation = navigation.filter(item => {
        // If the user is logged in, hide 'Login' and 'Register'
        if (user && !item.requiresAuth && (item.name === 'Login' || item.name === 'Register')) {
            return false;
        }

        // If the user is not logged in, hide 'Todos'
        if (!user && item.requiresAuth && item.name === 'Todos') {
            return false;
        }

        return true;
    });

    // Set the current item based on the current location
    useEffect(() => {
        console.log("NavBar rendered")

        navigation.forEach((item) => {
            if (item.href === location.pathname) {
                item.current = true;
                setNavigation([...navigation]);

            }
            else {
                item.current = false
                setNavigation([...navigation]);
            }
        });
    }, [location]);

    return (
        <Disclosure as="nav" className="bg-gray-800">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 justify-between">
                    <div className="flex">
                        <div className="-ml-2 mr-2 flex items-center md:hidden">
                            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                                <span className="absolute -inset-0.5" />
                                <span className="sr-only">Open main menu</span>
                                <Bars3Icon aria-hidden="true" className="block h-6 w-6 group-data-[open]:hidden" />
                                <XMarkIcon aria-hidden="true" className="hidden h-6 w-6 group-data-[open]:block" />
                            </DisclosureButton>
                        </div>
                        <div className="flex flex-shrink-0 items-center">
                            <img
                                alt="Your Company"
                                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                                className="h-8 w-auto"
                            />
                        </div>
                        <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
                            {filteredNavigation.map((item) => (
                                <div key={item.name}>
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        className={classNames(
                                            item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                            'rounded-md px-3 py-2 text-sm font-medium',
                                        )}
                                        onClick={() => {
                                            // set current to true for the clicked item, and false for the rest
                                            navigation.forEach((navItem) => {
                                                navItem.current = false;
                                            });
                                            item.current = true;
                                        }}
                                    >
                                        {item.name}
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                    {user && (
                        <div className="flex items-center">
                            <div className="hidden md:ml-4 md:flex md:flex-shrink-0 md:items-center">
                                <Menu as="div" className="relative ml-3">
                                    <div className="flex">
                                        <span className="text-sm font-medium text-gray-400 flex justify-center items-center mr-4">{user.email}</span>
                                        <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                            <span className="sr-only">Open user menu</span>
                                            <svg className="w-8 h-8 text-blue-700 dark:text-gray-700" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
                                            </svg>
                                        </MenuButton>
                                    </div>
                                    {/* User menu items */}
                                    <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                                        {userNavigation.map((item) => (
                                            <MenuItem key={item.name}>
                                                <a
                                                    href={item.href}
                                                    onClick={item.name === 'Logout' ? async (_e: React.MouseEvent) => {
                                                        handleLogout();
                                                    } : undefined}
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                    {item.name}
                                                </a>
                                            </MenuItem>
                                        ))}
                                    </MenuItems>
                                </Menu>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile menu */}
            <DisclosurePanel className="md:hidden">
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    {filteredNavigation.map((item) => (
                        <Link
                            key={item.name}
                            to={item.href}
                            className={classNames(
                                item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                'block rounded-md px-3 py-2 text-base font-medium',
                            )}
                            onClick={async (_e: React.MouseEvent) => {
                                if (item.name === 'Logout') {
                                    handleLogout();
                                }

                                // set current to true for the clicked item, and false for the rest
                                navigation.forEach((navItem) => {
                                    navItem.current = false;
                                });
                                item.current = true;
                            }}
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>
                {user && (
                    <div className="border-t border-gray-700 pb-3 pt-4">
                        <div className="flex items-center px-5 sm:px-6">
                            <div className="flex-shrink-0">
                                <svg className="w-8 h-8 text-blue-600 dark:text-gray-700" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
                                </svg>
                            </div>
                            {user && (
                                <>
                                    <div className="ml-3">
                                        {/*<div className="text-base font-medium text-white">{user.name}</div>*/}
                                        <div className="text-sm font-medium text-gray-400">{user.email}</div>
                                    </div>
                                    {/*<button
                            type="button"
                            className="relative ml-auto flex-shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                        >
                            <span className="absolute -inset-1.5" />
                            <span className="sr-only">View notifications</span>
                            <BellIcon aria-hidden="true" className="h-6 w-6" />
                        </button>*/}
                                </>
                            )}

                        </div>
                        {/* User menu items */}
                        {user && (
                            <div className="mt-3 space-y-1 px-2 sm:px-3">
                                {userNavigation.map((item) => (
                                    <DisclosureButton
                                        key={item.name}
                                        as="a"
                                        href={item.href}
                                        onClick={item.name === 'Logout' ? async (_e: React.MouseEvent) => {
                                            handleLogout();
                                        } : undefined}
                                        className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                                    >
                                        {item.name}
                                    </DisclosureButton>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </DisclosurePanel>


        </Disclosure >
    )
}
