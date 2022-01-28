import express from 'express'

export const router = express.Router()

router.get('/')

router.post('/create')

router.get('/:id/edit')
router.post('/:id/edit')

router.get('/:id/delete')
router.post('/:id/delete')
