import { Hono } from 'hono'
import { Bindings } from '../config/bindings.config';
import { Variables } from '../config/variables.config';
import { verifyJWT } from '../middlewares/verifyJWT';
import { addBlog, getBlogById, updateBlog, getAllBlogs, getBlogsOfUser, publishBlog, unpublishBlog, deleteBlog } from '../controllers/blog.controller'

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>()

app.use(verifyJWT)
app.post('/', addBlog)
app.put('/', updateBlog)
app.get('/', getAllBlogs)
app.get('/user/:userId', getBlogsOfUser)
app.get('/id/:blogId', getBlogById)
app.get('/publish/:blogId', publishBlog)
app.get('/unpublish/:blogId', unpublishBlog)
app.get('/delete/:blogId', deleteBlog)

export default app
