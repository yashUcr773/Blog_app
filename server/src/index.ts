import { Hono } from 'hono'
import authRouter from './routes/auth'
import blogRouter from './routes/blog'
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

app.use(cors())

app.get('/', (c) => {
    return c.text('Hello Hono!')
})

export default app
