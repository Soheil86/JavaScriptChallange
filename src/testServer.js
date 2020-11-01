import 'whatwg-fetch'
import { rest } from 'msw'
import { setupServer } from 'msw/node'

//I have used setup server here to create ourself server
const server = setupServer(
  rest.get('https://staging-api.joblocal.de/v4', (_req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ rates: { CAD: 1.42 } }))
  }),
  rest.get('*', (req, res, ctx) => {
    console.error(`Please add request handler for ${req.url.toString()}`)
    return res(
      ctx.status(500),
      //We show an error test if by mistaken put wrong API
      ctx.json({ error: 'You must add request handler.' })
    )
  })
)

beforeAll(() => server.listen())
afterAll(() => server.close())
afterEach(() => server.resetHandlers())

export { server, rest }
