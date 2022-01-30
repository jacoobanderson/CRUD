import express from 'express'
import { SnippetController } from '../controllers/snippet-controller.js'

export const router = express.Router()

const controller = new SnippetController()

router.get('/', controller.renderIndex)

router.post('/create', controller.createSnippet)

router.get('/:id/edit')
router.post('/:id/edit')

router.get('/:id/delete')
router.post('/:id/delete')
