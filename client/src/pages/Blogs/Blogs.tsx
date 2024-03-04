import { useEffect } from "react"
import { useAxiosPrivate } from "../../hooks/useAxiosPrivate"
import { CONSTANTS } from "../../../config/Constants"
import { useRecoilState } from "recoil"
import { blogAtom } from "../../store/atoms/blogAtom"
import { Posts } from "../../../config/types"
import { BlogTile } from "./BlogTile"


export function Blogs() {

    const customAxios = useAxiosPrivate()
    const [blogs, setBlogs] = useRecoilState(blogAtom)

    useEffect(() => {
        const getblogs = async () => {
            try {
                const response = await customAxios(CONSTANTS.BLOG.GET_ALL())
                setBlogs(response?.data?.blogs)
            } catch (e: any) {
                console.log(e)
            }
        }
        blogs.length == 0 && getblogs()
    }, [])

    return (
        <div className="flex flex-row flex-wrap gap-4 rounded-lg items-center justify-around">
            {blogs?.map((blog: Posts) => <BlogTile key={blog.id} blog={blog}></BlogTile>)}
        </div>
    )

}