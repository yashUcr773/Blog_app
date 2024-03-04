import { Blogs } from "./Blogs/Blogs"


export function Dashboard() {


    return (
        <section className="w-full h-full rounded-lg text-gray-900 dark:text-white">
            <div className="flex flex-col gap-0 w-full justify-between rounded-lg">
                <div className="flex flex-col py-4 px-4 h-full gap-4">
                    <Blogs></Blogs>
                </div>
            </div>
        </section>
    )
}

