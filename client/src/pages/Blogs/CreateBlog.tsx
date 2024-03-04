import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Editor from "../Editor";
import { useAxiosPrivate } from '../../hooks/useAxiosPrivate';
import { CONSTANTS } from '../../../config/Constants';
import { Loader } from '../../components/Loader';
import { useRecoilState } from "recoil";
import { categoriesAtom } from "../../store/atoms/blogAtom";

export function CreateBlog() {

    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState(`<p><br></p> <p><br></p> <p><br></p> <p><br></p> <p><br></p> <p><br></p> <p><br></p> <p><br></p> <p><br></p> <p><br></p> <p><br></p> <p><br></p> <p><br></p> <p><br></p> <p><br></p> <p><br></p> <p><br></p> <p><br></p>`);
    const [cover, setCover] = useState(null as any);
    const [published, setPublished] = useState(false)
    const [category, setCategory] = useState("")

    const [categories, setCategories] = useRecoilState(categoriesAtom)
    const [newCategory, setNewCategory] = useState("")
    const [addNewCategory, setAddNewCategory] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [error, setError] = useState("")

    const [isPageLoading, setIsPageLoading] = useState(false)
    const [networkCallInProgress, setNetworkCallInProgress] = useState(false)

    const navigate = useNavigate()

    const customAxios = useAxiosPrivate()

    useEffect(() => {
        async function getCategories() {
            setIsPageLoading(true)
            try {
                const fetchedCategories = await customAxios(CONSTANTS.CATEGORY.GET_ALL())
                setCategories(fetchedCategories.data.categories)
                setCategory(fetchedCategories.data.categories[0].name)
            } catch (e) {
                console.log(e)
                setCategories([])
            } finally {
                setIsPageLoading(false)
            }
        }
        categories.length == 0 ? getCategories() : setCategory(categories[0].name)
    }, [])

    useEffect(() => {
        setError("")
    }, [title, summary, content, cover, category, newCategory])

    function dropdownChangeHandler(event: any) {
        if (event.target.value === '2') {
            setAddNewCategory(true)
        } else {
            setAddNewCategory(false)
            setNewCategory("")
        }
        setCategory(event.target.value)
    }

    async function createNewPost(ev: any) {
        ev.preventDefault();
        let finalCategory = newCategory ? newCategory : category

        if (!finalCategory || !title || !content || !cover[0] || !summary) {
            setError("All Fields are Required!")
            return
        }

        setNetworkCallInProgress(true)
        try {
            await customAxios.post(CONSTANTS.BLOG.POST_ADD_BLOG(), {
                title, content, cover: cover[0], summary, publishedStr: published, category: finalCategory
            }, { headers: { 'Content-Type': "multipart/form-data" } })
            navigate('/')
        } catch (err) {
            console.log(err)
        } finally {
            setNetworkCallInProgress(false)
        }

    }

    async function validatePage1(e: any) {
        e.preventDefault()
        let finalCategory = newCategory ? newCategory : category
        if (!finalCategory || !title || !cover[0] || !summary) {
            setError("All Fields are Required!")
            return
        }

        setCurrentPage(2)
    }

    if (isPageLoading) {
        return <Loader fullPage={true}></Loader>
    }

    return (
        <div className="flex flex-col justify-center items-center w-full h-full">
            <div className="relative p-4 w-full max-w-2xl h-full">
                <div className="relative p-4 bg-white rounded-lg shadow gap-2 dark:bg-gray-800 sm:p-5 border border-primary-500">
                    <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Add Blog
                        </h3>
                    </div>
                    <form onSubmit={validatePage1} className={` ${currentPage === 1 ? "block" : 'hidden'}`}>
                        <div className={`page-1 flex flex-col gap-4 `}>
                            <div className='title'>
                                <label
                                    htmlFor="title"
                                    className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white">
                                    Title
                                </label>
                                <input
                                    required
                                    type="text"
                                    name="title"
                                    id="title"
                                    onChange={e => setTitle(e.target.value)}
                                    value={title}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                    placeholder="Enter Title" />
                            </div>
                            <div className='summary'>
                                <label
                                    htmlFor="summary"
                                    className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white">Summary</label>
                                <input
                                    required
                                    type="text"
                                    name="summary"
                                    id="summary"
                                    onChange={e => setSummary(e.target.value)}
                                    value={summary}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                    placeholder="Enter Summary" />
                            </div>
                            <div className='cover'>
                                <label
                                    htmlFor="cover"
                                    className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white">Cover Image</label>
                                <input
                                    required
                                    type="file"
                                    name="cover"
                                    id="cover"
                                    onChange={ev => setCover(ev.target.files)}
                                    placeholder="Cover Image"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                />
                            </div>
                            <div className='category-dropdown'>
                                <label htmlFor="category" className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white">Category</label>
                                <select id="category"
                                    onChange={dropdownChangeHandler}
                                    defaultValue={categories[0]?.name}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                                    {categories.map((category: any) => <option key={category.id} value={category.name}>{category.name}</option>)}
                                    <option key={2} value={"2"}>Other</option>
                                </select>
                            </div>
                            <div className={`new-category ${addNewCategory ? 'block' : 'hidden'}`} >
                                <label
                                    htmlFor="newCategory"
                                    className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white">New Category</label>
                                <input
                                    required={addNewCategory ? true : false}
                                    type="text"
                                    name="newCategory"
                                    id="newCategory"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                    value={newCategory}
                                    onChange={e => setNewCategory(e.target.value)}
                                    placeholder="Enter new category" />
                            </div>
                            <div className='published flex items-center mb-4 gap-2'>
                                <label htmlFor="published-checkbox"
                                    className="ms-2 text-sm font-semibold text-gray-900 dark:text-gray-300">
                                    Publish
                                </label>
                                <input
                                    id="published-checkbox"
                                    type="checkbox"
                                    checked={published}
                                    onChange={(e) => setPublished(e.target.checked)}
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />

                            </div>
                            <div className="flex flex-row items-end justify-end">
                                <button
                                    className="text-white flex justify-between gap-2 items-center bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-semibold rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                                    Add content
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </form>
                    <form onSubmit={createNewPost} className={`page-2 flex flex-col gap-4 ${currentPage === 2 ? "flex" : 'hidden'}`}>

                        <div className={`page-2 flex flex-col gap-4 `}>
                            <div className='content'>
                                <label htmlFor="published-checkbox"
                                    className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white">
                                    Content
                                </label>
                                <Editor value={content} onChange={setContent} />
                            </div>
                            <div className="flex flex-row items-center justify-between">
                                <button
                                    onClick={() => setCurrentPage(1)}
                                    className="text-white flex gap-2 justify-between items-center bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-semibold rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                                    </svg>
                                    Previous
                                </button>
                                <button type="submit" className="text-white flex flex-row justify-between gap-2 items-center bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-semibold rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                                    <svg className="mr-1 -ml-1 w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"></path></svg>
                                    Create Blog {networkCallInProgress ? <Loader fullPage={false}></Loader> : null}
                                </button>
                            </div>
                        </div>
                    </form>
                    <div className={`error-feedback mt-4 flex-row w-full justify-center items-center ${error ? 'flex' : 'hidden'}`}>
                        <div className="p-4 mb-4 text-center text-sm text-red-800 w-full rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                            <span> {error}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}