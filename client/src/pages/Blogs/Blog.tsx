import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAxiosPrivate } from "../../hooks/useAxiosPrivate";
import { CONSTANTS } from "../../../config/Constants";
import { Loader } from "../../components/Loader";
import { ProfilePhoto } from "../../components/ProfilePhoto";
import { formatDate } from "../../utils/data";
import { useRecoilValue } from "recoil";
import { userAtom } from "../../store/atoms/userAtom";
import { completeUserInterface, Posts } from "../../../config/types";

export function Blog() {
    const { state } = useLocation();
    const customAxios = useAxiosPrivate()
    const [showLoader, setShowLoader] = useState(false)
    const [userData, setUserData] = useState({} as completeUserInterface)
    const [blogData, setBlogData] = useState({} as Posts)
    const user = useRecoilValue(userAtom)
    const navigate = useNavigate()

    useEffect(() => {

        async function getUserandBlogData() {

            setShowLoader(true)
            try {

                let responses: any = await Promise.allSettled([
                    customAxios.get(CONSTANTS.USER.GET_BY_ID(state.userId)),
                    customAxios.get(CONSTANTS.BLOG.GET_BY_ID(state.blogId)),
                ])

                setUserData(responses[0].value.data.user)
                setBlogData(responses[1].value.data.blog)

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

    function editPost() {
        if (userData.id != user?.id) {
            return
        }

        navigate('/updateBlog', { state: { blogData } })

    }

    async function deletePost() {
        if (userData.id != user?.id) {
            return
        }
        await customAxios(CONSTANTS.BLOG.GET_DELETE(blogData.id))
        navigate('/')
    }

    async function PublishPost() {
        if (userData.id != user?.id) {
            return
        }
        await customAxios(CONSTANTS.BLOG.GET_PUBLISH(blogData.id))
        navigate('/')
    }

    async function UnpublishPost() {
        if (userData.id != user?.id) {
            return
        }
        await customAxios(CONSTANTS.BLOG.GET_UNPUBLISH(blogData.id))
        navigate('/')
    }

    return (
        <section className="py-6 px-4 lg:py-12 lg:px-8 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 w-5/6 break-all">
            <div className="flex flex-col items-end justify-between px-4 mx-auto">
                <div className={`flex flex-wrap rounded-md shadow-sm ${userData.id == user?.id ? "block" : "hidden"} pb-4 sm:p-0`} role="group">
                    <button onClick={editPost} type="button" className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-s-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white">
                        Edit
                    </button>
                    <button onClick={PublishPost} type="button" className={` ${blogData.published === true ? "hidden" : "block"} px-4 py-2 text-sm font-medium text-gray-900 bg-white border-t border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white`}>
                        Publish
                    </button>
                    <button onClick={UnpublishPost} type="button" className={` ${blogData.published === true ? "block" : "hidden"} px-4 py-2 text-sm font-medium text-gray-900 bg-white border-t border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white`}>
                        Unpublish
                    </button>
                    <button onClick={deletePost} type="button" className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-e-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white">
                        Delete
                    </button>
                </div>
                <article className="mx-auto w-full  ">
                    <header className="mb-4 lg:mb-6 flex flex-row justify-between items-center w-full">
                        <address className="flex items-center mb-6 not-italic">
                            <div className="flex items-center mr-3 text-sm text-gray-900 dark:text-white gap-4">
                                <div className="shrink-0">
                                    <ProfilePhoto src={userData.profilePhoto} alt={userData.username} />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <Link to={`/user/${userData.id}/posts`} rel="author" className="text-xl cursor-pointer font-bold text-gray-900 dark:text-white underline">@{userData.username}</Link>
                                    <p className="text-base text-gray-500 dark:text-gray-400">{userData.email}</p>
                                    <p className="text-base text-gray-500 dark:text-gray-400"> Member since -
                                        <time title="February 8th, 2022" className="px-2">{formatDate(userData.createdAt)}</time>
                                    </p>
                                </div>
                            </div>
                        </address>
                    </header>
                    <hr className="my-4 mb-8 border-gray-200 mx-auto dark:border-gray-700" />
                    <img src={blogData.cover} className="border rounded w-fit mx-auto max-h-60 aspect-auto mb-8"></img>
                    <h1 className="mb-4 text-3xl font-extrabold leading-tight text-gray-900 lg:mb-6 lg:text-4xl dark:text-white">{blogData.title}</h1>
                    <div className="text-end my-4">
                        <p className="text-base text-gray-500 dark:text-gray-400"> Published -
                            <time title="February 8th, 2022" className="px-2">{formatDate(blogData.createdAt)}</time>
                        </p>
                        <p className={`text-base text-gray-500 dark:text-gray-400 ${blogData.createdAt == blogData.updatedAt ? "hidden" : ""}`}> Updated -
                            <time title="February 8th, 2022" className="px-2">{formatDate(blogData.updatedAt)}</time>
                        </p>
                    </div>
                    <main dangerouslySetInnerHTML={{ __html: blogData.content }}>
                    </main>
                </article>
            </div>
        </section>
    );
}