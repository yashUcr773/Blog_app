import { Hono } from 'hono'
import { Bindings } from '../config/bindings.config';
import { Variables } from '../config/variables.config';
import { verifyJWT } from '../middlewares/verifyJWT';
import { getAllCategories } from '../controllers/category.controller'

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>()

app.use(verifyJWT)
app.get("/", getAllCategories);

export default app
