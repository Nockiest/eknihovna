

// app/api/users.test.ts
// import { createMocks } from 'node-mocks-http'
// import {GET} from '../app/api/testGet/route'

// describe('/api/users', () => {
//   test('returns a list of users', async () => {
//     const { req, res } = createMocks({
//       method: 'GET',
//     })

//     const response = await GET(req)

//     expect(response.status).toBe(200)
//     expect(await response.json()).toEqual([
//       { id: 1, name: 'Alice' },
//       { id: 2, name: 'Bob' },
//     ])
//   })
// })