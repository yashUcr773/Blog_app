import { Hono } from 'hono'
import { Bindings } from '../config/bindings.config';
import { Variables } from '../config/variables.config';
import { verifyJWT } from '../middlewares/verifyJWT';
import { getAllUsers, getUserByFilter, getUserById, updateUserInfo } from '../controllers/user.controller'

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>()

app.use(verifyJWT)
app.get("/id/:id", getUserById);
app.get("/filter", getUserByFilter);
app.get("/", getAllUsers);
app.put("/", updateUserInfo);

export default app
