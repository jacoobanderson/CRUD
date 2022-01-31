import express from 'express'
import { SnippetController } from '../controllers/snippet-controller.js'

export const router = express.Router()

const controller = new SnippetController()

router.get('/', controller.renderIndex)

router.post('/create', controller.createSnippet)

router.get('/:id/edit', controller.renderEdit)
router.post('/:id/edit', controller.edit)

router.get('/:id/delete', controller.renderDelete)
router.post('/:id/delete', controller.delete)
