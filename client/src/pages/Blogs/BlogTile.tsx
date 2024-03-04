import { useNavigate } from "react-router-dom"
import { Posts } from "../../../config/types"
import { formatDate } from "../../utils/data"
import { useRecoilValue } from "recoil"
import { userAtom } from "../../store/atoms/userAtom"

interface BlogInterface {
    blog: Posts
}

export function BlogTile({ blog }: BlogInterface) {

    const navigate = useNavigate()
    const currentUser = useRecoilValue(userAtom)

    function navigateToBlog() {
        navigate('/blog/' + blog.id, { state: { userId: blog.authorId, blogId: blog.id } })
    }

    if (!blog.published && blog.authorId != currentUser?.id) {
        return <></>
    }

    return (
        <div className="flex w-96 flex-col gap-1 items-center bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700">
            <img className="rounded-t-lg" src={blog.cover} alt="" />
            <div className="p-4 w-full">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{blog.title}</h5>
                <p className="mb-2 font-normal text-gray-700 dark:text-gray-400">{blog.summary}</p>
                <p className="font-normal text-gray-700 dark:text-gray-400 cursor-pointer">Written by @<span className="underline text-gray-900 dark:text-white" onClick={() => { navigate(`/user/${blog?.authorId}/posts`); }}>{blog.author.username}</span></p>
                <p className="mb-2 font-normal text-gray-700 dark:text-gray-400">Created: {formatDate(blog.createdAt)}</p>
                <div className="w-full flex flex-row items-center justify-between">
                    <button onClick={navigateToBlog} className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-primary-700 rounded-lg hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                        Read more
                    </button>
                    <div className="flex flex-row">
                    <span className="bg-blue-100 hover:bg-blue-200 text-blue-800 text-xs font-semibold me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-blue-400 border border-blue-400 inline-flex items-center justify-center">
                        {blog.category.name}</span>
                    <span className={`bg-red-100 hover:bg-red-200 text-red-800 text-xs font-semibold me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-red-400 border border-red-400 inline-flex items-center justify-center ${!blog.published ? "block" : "hidden"}`}>
                        Unpublished</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
