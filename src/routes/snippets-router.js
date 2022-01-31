import express from 'express'
import { SnippetController } from '../controllers/snippet-controller.js'

export const router = express.Router()

const controller = new SnippetController()

router.get('/', controller.renderIndex)

router.post('/create', controller.auth, controller.createSnippet)

router.get('/:id/edit', controller.auth, controller.renderEdit)
router.post('/:id/edit', controller.auth, controller.edit)

router.get('/:id/delete', controller.auth, controller.renderDelete)
router.post('/:id/delete', controller.auth, controller.delete)
