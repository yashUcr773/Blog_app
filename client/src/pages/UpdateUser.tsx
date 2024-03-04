import { useRecoilState } from 'recoil'
import { userAtom } from '../store/atoms/userAtom'
import { useEffect, useState } from 'react'
import { CONSTANTS } from '../../config/Constants'
import { Loader } from '../components/Loader'
import { useAxiosPrivate } from '../hooks/useAxiosPrivate'
import { ProfilePhoto } from '../components/ProfilePhoto'
import { useNavigate } from 'react-router-dom'

export function UpdateInfo() {

    const [cover, setCover] = useState("" as any)
    const [currentPassword, setCurrentPassword] = useState("" as any)
    const [newPassword, setNewPassword] = useState("" as any)
    const [confirmPassword, setConfirmPassword] = useState("" as any)
    const [formError, setFormError] = useState("")
    const [showLoader, setshowLoader] = useState(false)
    const [updateSuccess, setUpdateSuccess] = useState(false)
    const [user, setUser] = useRecoilState(userAtom)

    const customAxios = useAxiosPrivate()
    const navigate = useNavigate();

    useEffect(() => {
        setFormError("")
    }, [cover, currentPassword, newPassword, confirmPassword])

    async function updateDetails(e: any) {
        e.preventDefault()

        if (newPassword != "" && newPassword !== confirmPassword) {
            setUpdateSuccess(false)
            setFormError("Passwords do not match")
            return
        }

        if (currentPassword != "" && newPassword == "") {
            setUpdateSuccess(false)
            setFormError("Please enter new password")
            return
        }

        if (cover == "" && currentPassword == "" && newPassword == "" && confirmPassword == "") {
            setUpdateSuccess(false)
            setFormError("Atleast update 1 field")
            return
        }

        if (newPassword != "" && !CONSTANTS.PWD_REGEX.test(newPassword)) {
            setUpdateSuccess(false)
            setFormError("Please choose a stronger password. Try a mix of letters, numbers, and symbols upto 24 characters.")
            return
        }


        try {
            setshowLoader(true)
            let response = await customAxios.put(CONSTANTS.USER.PUT_USER(),
                {
                    cover: cover == "" ? null : cover[0],
                    currentPassword: currentPassword == "" ? null : currentPassword,
                    newPassword: newPassword == "" ? null : newPassword,
                    confirmPassword: confirmPassword == "" ? null : confirmPassword,
                },
                {
                    headers: { 'Content-Type': "multipart/form-data" }
                })

            setUser((p: any) => ({
                ...p,
                password: response.data.user.password,
                profilePhoto: response.data.user.profilePhoto
            }))
            setCover("")
            setCurrentPassword("")
            setNewPassword("")
            setConfirmPassword("")

            setUpdateSuccess(true)
            setFormError('Updated Successfully')

            navigate('/')

        } catch (e: any) {
            console.log(e)
            setFormError(e.response.data.message)
            setUpdateSuccess(false)
        } finally {
            setshowLoader(false)
        }
    }

    return (
        <section className="bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col gap-4 items-center justify-start  mx-auto ">
                <div className="w-full sm:w-96 bg-white rounded-lg shadow dark:border md:mt-0 xl:p-0 dark:bg-gray-800 dark:border-primary-500 border border-primary-500">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">

                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Update Info
                        </h1>

                        <form className="space-y-4 md:space-y-6" onSubmit={updateDetails}>

                            <div className='cover'>
                                <label
                                    htmlFor="cover"
                                    className="w-full flex flex-col gap-2 items-center justify-center text-sm mb-2 font-medium text-gray-900 dark:text-white" >
                                    <ProfilePhoto src={user?.profilePhoto} ></ProfilePhoto>
                                    Profile photo
                                </label>
                                <input
                                    type="file"
                                    name="cover"
                                    id="cover"
                                    onChange={ev => setCover(ev.target.files)}
                                    placeholder="Cover Image"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="currentPassword"
                                    className="block text-sm mb-2 font-medium text-gray-900 dark:text-white">
                                    Current password</label>
                                <input type="password" id="currentPassword" name="currentPassword"
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    value={currentPassword}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder={"••••••••"} />
                            </div>

                            <div>
                                <label htmlFor="newPassword"
                                    className="block text-sm mb-2 font-medium text-gray-900 dark:text-white">
                                    New Password</label>
                                <input type="password" id="newPassword" name="newPassword"
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    value={newPassword}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder={"••••••••"} />
                            </div>

                            <div>
                                <label htmlFor="confirmPassword"
                                    className="block text-sm mb-2 font-medium text-gray-900 dark:text-white">
                                    Confirm Password</label>
                                <input type="password" id="confirmPassword" name="confirmPassword"
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    value={confirmPassword}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder={"••••••••"} />
                            </div>

                            <p className={`rounded-lg w-full text-center text-sm font-normal ${updateSuccess ? 'text-green-600' : 'text-red-600'} whitespace-break-spaces`}>{formError}</p>

                            <button type="submit"
                                className="flex flex-row items-center justify-center gap-4 w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                                Update {showLoader ? <Loader size={'sm'} /> : ""}
                            </button>
                        </form>

                    </div>

                </div >
            </div >
        </section >
    )
}
