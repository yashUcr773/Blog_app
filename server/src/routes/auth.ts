import { Hono } from 'hono'
import { Bindings } from '../config/bindings.config'
import { Variables } from '../config/variables.config'
import { handleLogout, handleRefreshToken, handleSignin, handleSignup } from '../controllers/auth.controller'
const app = new Hono<{ Variables: Variables, Bindings: Bindings }>()

app.post('/signup', handleSignup)
app.post('/signin', handleSignin)
app.get('/signout', handleLogout)
app.get('/refresh', handleRefreshToken)

export default app
