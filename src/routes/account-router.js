import express from 'express'
import { AccountController } from '../controllers/account.js'

export const router = express.Router()

const controller = new AccountController()

router.get('/register', controller.anonymousCheck, controller.renderRegister)

router.get('/login', controller.anonymousCheck, controller.renderLogin)

router.post('/register', controller.anonymousCheck, controller.register)

router.post('/login', controller.anonymousCheck, controller.login)

router.get('/logout', controller.loggedInCheck, controller.logout)
