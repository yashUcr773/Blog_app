import { Link, useParams } from "react-router-dom";
import { ProfilePhoto } from "../components/ProfilePhoto";
import { formatDate } from "../utils/data";
import { Posts, completeUserInterface } from "../../config/types";
import { BlogTile } from "./Blogs/BlogTile";
import { useAxiosPrivate } from "../hooks/useAxiosPrivate";
import { useEffect, useState } from "react";
import { CONSTANTS } from "../../config/Constants";
import { Loader } from "../components/Loader";

export function UserPosts() {

    const customAxios = useAxiosPrivate()
    const [showLoader, setShowLoader] = useState(false)
    const [userData, setUserData] = useState({} as completeUserInterface)
    const [blogs, setBlogs] = useState([] as Posts[])

    const { userId }: any = useParams();

    useEffect(() => {

        async function getUserandBlogData() {
            setShowLoader(true)
            try {
                let responses: any = await Promise.allSettled([
                    customAxios.get(CONSTANTS.USER.GET_BY_ID(userId)),
                    customAxios.get(CONSTANTS.BLOG.GET_BLOGS_OF_USER(userId)),
                ])
                setUserData(responses[0].value.data.user)
                setBlogs(responses[1].value.data.blogs)
            } catch (e) {
                console.log(e)
            } finally {
                setShowLoader(false)
            }

        }

        getUserandBlogData()

    }, [])

    if (showLoader) {
        return <Loader fullPage={true}></Loader>
    }

    return (
        <section className="w-full">
            <div className="user-info-section w-full flex flex-row items-center justify-center">
                <header className="p-4 flex flex-row justify-between items-center w-full bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                    <address className="w-full flex flex-row items-center justify-center mb-6 not-italic">
                        <div className="w-full flex flex-row items-center justify-center mr-3 text-sm text-gray-900 dark:text-white gap-4">
                            <div className="shrink-0">
                                <ProfilePhoto src={userData.profilePhoto} alt={userData.username} size={20} />
                            </div>
                            <div className="flex flex-col gap-1">
                                <Link to={`/user/${userData.id}/posts`} rel="author" className="text-xl cursor-pointer font-bold text-gray-900 dark:text-white underline">@{userData.username}</Link>
                                <p className="text-base text-gray-500 dark:text-gray-400">{userData.email}</p>
                                <p className="text-base text-gray-500 dark:text-gray-400"> Member since -
                                    <time title="February 8th, 2022" className="px-2">{formatDate(userData.createdAt)}</time>
                                </p>
                                <span className="text-base text-gray-500 dark:text-gray-400">Posts Published: <span>{blogs.length}</span></span>
                            </div>
                        </div>
                    </address>
                </header>
            </div>
            <hr className="my-4 mb-8 border-gray-200 mx-auto dark:border-gray-700" />
            <div className="user-blog-section">
                <div className="flex flex-row flex-wrap gap-4 rounded-lg items-center justify-around">
                    {blogs?.map((blog: Posts) => <BlogTile key={blog.id} blog={blog}></BlogTile>)}
                </div>
            </div>
        </section>
    )
}