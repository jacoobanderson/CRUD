import { router as snippetsRouter } from './snippets-router.js'
import express from 'express'

export const router = express.Router()

router.use('/', snippetsRouter)
