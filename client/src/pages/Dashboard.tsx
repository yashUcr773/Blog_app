import { Link } from "react-router-dom"
import { useLogout } from "../hooks/useLogout"

export function Dashboard() {
    const logout = useLogout()
    async function handleLogout() {
        await logout({ })

    }

    return (
        <section className="bg-gray-50 dark:bg-gray-900 w-full h-full rounded-lg text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-700 ">
            <div className="flex flex-col gap-0 w-full justify-between rounded-lg bg-white dark:bg-gray-800">
                <div className="flex flex-col overflow-y-auto py-4 px-4 h-full bg-white rounded-lg dark:bg-gray-800 dark:border-gray-700 gap-4">
                    <h1 className="font-bold text-3xl">Home</h1>
                    <h3 className="font-semibold text-xl">You are logged in</h3>
                    <Link to="/editor" className="underline">Go to Editor only page</Link>
                    <Link to="/admin" className="underline">Go to admin only page</Link>
                    <Link to="/lounge" className="underline">Go to lounge page</Link>
                    <Link to="/linkpage" className="underline">Go to links page</Link>
                    <button onClick={() => handleLogout()} className="border border-black bg-black text-white text-lg font-semibold p-2 px-4 rounded-md">Sign out</button>
                </div>
            </div>
        </section>
    )
}

