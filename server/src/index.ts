import { Hono } from 'hono'
import authRouter from './routes/auth'
import blogRouter from './routes/blog'

const app = new Hono()

app.route('/auth', authRouter)
app.route('/api/v1/blog', blogRouter)

app.get('/', (c) => {
    return c.text('Hello Hono!')
})

export default app
