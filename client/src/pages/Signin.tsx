import { useEffect, useState } from "react"
import { Loader } from "../components/Loader"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { CONSTANTS, customAxios } from "../../config/Constants";
import { useSetCurrentSession } from "../hooks/useSetCurrentSession";

export function Signin() {

    const navigate = useNavigate();
    const location = useLocation()
    const from = location.state?.from?.pathname || "/"

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [err, setErr] = useState("")
    const [showLoader, setShowLoader] = useState(false)
    const setCurrentSession = useSetCurrentSession()

    useEffect(() => {
        setErr("")
    }, [email, password])

    async function handleSubmit(e: any) {
        e.preventDefault()
        setShowLoader(true)
        try {
            const response = await customAxios.post(CONSTANTS.AUTH.POST_SIGNIN(), { email, password }, { withCredentials: true })
            const { accessToken, ...user } = response.data.user
            setCurrentSession({ accessToken, userData: user })

            navigate(from, { replace: true })

        } catch (e: any) {
            setCurrentSession({ accessToken: null, userData: null })

            setErr(e.response.data.message)
            console.log(e)
        }
        finally {
            setShowLoader(false)
        }
    }

    function handleRememberMe(e: any) {
        localStorage.setItem('persistence', JSON.stringify(e.target.checked))
    }

    return (
        <section className="bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col gap-4 items-center justify-start mt-8 px-6 py-8 mx-auto  lg:py-0 ">
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-primary-500 border border-primary-500">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Sign in to your account
                        </h1>
                        <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="email"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Email or Username</label>
                                <input type="text" name="email" id="email"
                                    onChange={(e) => setEmail(e.target.value)}
                                    value={email}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="name@company.com" required />
                            </div>
                            <label htmlFor="password"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Password</label>
                            <div className="relative">

                                <input type={showPassword ? "text" : "password"}
                                    onChange={(e) => setPassword(e.target.value)}
                                    value={password}
                                    name="password" id="password" placeholder="••••••••"
                                    className="relative bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg  focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    required />
                                <div className="absolute w-12 top-0 right-0 px-2 h-full flex flex-col items-center justify-center">
                                    {
                                        !showPassword ?
                                            <svg className="h-6 text-gray-700" fill="none" onClick={() => setShowPassword(true)}
                                                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                                                <path fill="currentColor"
                                                    d="M572.52 241.4C518.29 135.59 410.93 64 288 64S57.68 135.64 3.48 241.41a32.35 32.35 0 0 0 0 29.19C57.71 376.41 165.07 448 288 448s230.32-71.64 284.52-177.41a32.35 32.35 0 0 0 0-29.19zM288 400a144 144 0 1 1 144-144 143.93 143.93 0 0 1-144 144zm0-240a95.31 95.31 0 0 0-25.31 3.79 47.85 47.85 0 0 1-66.9 66.9A95.78 95.78 0 1 0 288 160z">
                                                </path>
                                            </svg> :
                                            <svg className="h-6 text-gray-700" fill="none" onClick={() => setShowPassword(false)}
                                                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                                                <path fill="currentColor"
                                                    d="M320 400c-75.85 0-137.25-58.71-142.9-133.11L72.2 185.82c-13.79 17.3-26.48 35.59-36.72 55.59a32.35 32.35 0 0 0 0 29.19C89.71 376.41 197.07 448 320 448c26.91 0 52.87-4 77.89-10.46L346 397.39a144.13 144.13 0 0 1-26 2.61zm313.82 58.1l-110.55-85.44a331.25 331.25 0 0 0 81.25-102.07 32.35 32.35 0 0 0 0-29.19C550.29 135.59 442.93 64 320 64a308.15 308.15 0 0 0-147.32 37.7L45.46 3.37A16 16 0 0 0 23 6.18L3.37 31.45A16 16 0 0 0 6.18 53.9l588.36 454.73a16 16 0 0 0 22.46-2.81l19.64-25.27a16 16 0 0 0-2.82-22.45zm-183.72-142l-39.3-30.38A94.75 94.75 0 0 0 416 256a94.76 94.76 0 0 0-121.31-92.21A47.65 47.65 0 0 1 304 192a46.64 46.64 0 0 1-1.54 10l-73.61-56.89A142.31 142.31 0 0 1 320 112a143.92 143.92 0 0 1 144 144c0 21.63-5.29 41.79-13.9 60.11z">
                                                </path>
                                            </svg>
                                    }
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="flex items-center h-5">
                                    <input id="remember" aria-describedby="remember" type="checkbox" onChange={handleRememberMe}
                                        className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                                    />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label htmlFor="remember"
                                        className="text-gray-500 dark:text-gray-300 select-none">Remember me</label>
                                </div>
                            </div>
                            <p className={`rounded-lg w-full text-left text-sm font-normal text-red-600 whitespace-break-spaces`}>{err}</p>
                            <button type="submit"
                                className="flex flex-row items-center justify-center gap-4 w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                                Sign in {showLoader ? <Loader fullPage={false} /> : null}
                            </button>
                            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                Don't have an account yet? <Link to="/signup" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up</Link>
                            </p>
                        </form>
                    </div>
                </div >
            </div >
        </section >
    )
}