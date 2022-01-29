import express from 'express'
import { AccountController } from '../controllers/account.js'

export const router = express.Router()

const controller = new AccountController()

router.get('/register', controller.renderRegister)

router.get('/login', controller.renderLogin)

router.post('/register', controller.register)

router.post('/login', controller.login)
