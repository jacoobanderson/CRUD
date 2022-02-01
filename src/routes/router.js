import { router as snippetsRouter } from './snippets-router.js'
import { router as accountRouter } from './account-router.js'
import express from 'express'

export const router = express.Router()

router.use('/', snippetsRouter)
router.use('/account', accountRouter)

router.use('*', (req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})
