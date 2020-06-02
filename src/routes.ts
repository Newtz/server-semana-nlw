import express from 'express'

const routes = express.Router()

routes.get('/', (req, res) => {
    console.log('hello world')
})


export default routes