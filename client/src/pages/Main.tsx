import { Route, Routes } from "react-router-dom";
import { Signin } from "./Signin";
import { Signup } from "./Signup";
import { Layout } from "./Layout";
import { Dashboard } from "./Dashboard";
import { NotFound } from "./NotFound";
import { RequireAuth } from "../components/RequireAuth";
import { PersistentLogin } from "../components/PersistentLogin";
import { IsLoggedInComponent } from "../components/IsLoggedInComponent";
import { CreateBlog } from "./Blogs/CreateBlog";
import { UpdateBlog } from "./Blogs/UpdateBlog";
import { UpdateInfo } from "./UpdateUser";
import { Blog } from "./Blogs/Blog";
import { UserPosts } from "./UserPosts";

export function Main() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>

                {/* public routes */}
                <Route element={<IsLoggedInComponent />}>
                    <Route path='signin' element={<Signin />}></Route>
                    <Route path='signup' element={<Signup />}></Route>
                </Route>

                {/* Protected */}
                <Route element={<PersistentLogin />}>
                    <Route element={<RequireAuth />}>
                        <Route path='/dashboard' element={<Dashboard />}></Route>
                        <Route path='/createBlog' element={<CreateBlog />}></Route>
                        <Route path='/blog/:blogId' element={<Blog />}></Route>
                        <Route path='/updateBlog' element={<UpdateBlog />}></Route>
                        <Route path='/user/:userId/posts' element={<UserPosts />}></Route>
                        <Route path='/updateProfile' element={<UpdateInfo />}></Route>
                        <Route path='/' element={<Dashboard />}></Route>
                    </Route>

                    {/* Catch All */}
                    <Route path='*' element={<NotFound />}></Route>
                </Route>

            </Route>
        </Routes >
    )
}
