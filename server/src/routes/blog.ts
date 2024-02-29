import { Hono } from 'hono'
import { Bindings } from '../config/bindings.config';
import { Variables } from '../config/variables.config';
import { verifyJWT } from '../middlewares/verifyJWT';
import { addBlog, getBlogById, updateBlog, getAllBlogs } from '../controllers/blog.controller'

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>()

app.use(verifyJWT)
app.post('/', addBlog)
app.put('/', updateBlog)
app.get('/', getAllBlogs)
app.get('/:blogId', getBlogById)

export default app
