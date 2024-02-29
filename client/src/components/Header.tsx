import { Link } from "react-router-dom"
import { useRecoilValue } from "recoil"
import { accessTokenAtom } from "../store/atoms/authAtom"
import { useLogout } from "../hooks/useLogout"
import { useEffect, useState } from "react"

export function Header() {

    const accessToken = useRecoilValue(accessTokenAtom)
    const logout = useLogout()
    const [isDarkMode, setIsDarkMode] = useState(
        localStorage.getItem('color-theme') === 'dark' ||
        (!localStorage.getItem('color-theme') &&
            window.matchMedia('(prefers-color-scheme: dark)').matches)
    );

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('color-theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('color-theme', 'light');
        }
    }, [isDarkMode]);

    const toggleTheme = () => {
        setIsDarkMode((prevIsDarkMode) => !prevIsDarkMode);
    };

    async function handleLogout() {
        await logout({  })
    }

    return (
        <header>
            <nav className="h-fit flex items-center justify-center p-4">
                <div className="flex flex-col xs:flex-row gap-2 justify-between items-center mx-auto w-full">
                    <Link to="/dashboard" className="logo flex flex-row gap-1 justify-center items-center">
                        <img src="/logo.png" alt="Logo" className="size-6" />
                        <span className="self-center text-xl font-semibold whitespace-nowrap text-primary-500">QuickPost.</span>
                    </Link>
                    <div className="flex flex-row gap-2 items-center justify-center ">
                        <button id="theme-toggle" type="button" onClick={toggleTheme}
                            className="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-1">
                            <svg id="theme-toggle-dark-icon" className={`size-6 ${!isDarkMode ? '' : 'hidden'}`} fill="currentColor"
                                viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
                            </svg>
                            <svg id="theme-toggle-light-icon" className={`size-6 ${isDarkMode ? '' : 'hidden'}`} fill="currentColor"
                                viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                                    fillRule="evenodd" clipRule="evenodd"></path></svg>
                        </button>
                        {
                            !accessToken ?
                                <div className="flex items-center lg:order-2">
                                    <Link to="/signin"
                                        className="text-gray-800 dark:text-white hover:bg-gray-200 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800">
                                        Log in</Link>
                                    <Link to="/signup"
                                        className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800">
                                        Get started</Link>
                                </div> :
                                <div className="flex items-center lg:order-2">
                                    <Link to="/linkpage"
                                        className="text-gray-800 dark:text-white hover:bg-gray-200 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800">
                                        links</Link>
                                    <button onClick={() => handleLogout()}
                                        className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800">
                                        Log out</button>
                                </div>
                        }
                    </div>
                </div>
            </nav>
        </header>
    )
}

