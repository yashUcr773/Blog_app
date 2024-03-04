import { Hono } from 'hono'
import authRouter from './routes/auth.routes'
import blogRouter from './routes/blog.routes'
import userRouter from './routes/user.routes'
import categoryRouter from './routes/category.routes'
import { cors } from 'hono/cors'
import { allowedOrigins } from './config/allowedOrigins.config'

const app = new Hono()

app.use('/auth/*', cors({
    origin: allowedOrigins,
    credentials: true
}))

app.use('/api/*', cors({
    origin: allowedOrigins,
    credentials: true
}))

app.route('/auth', authRouter)
app.route('/api/v1/blog', blogRouter)
app.route('/api/v1/user', userRouter)
app.route('/api/v1/category', categoryRouter)

app.use(cors())

app.get('/', (c) => {
    return c.text('Hello Hono!')
})

export default app
