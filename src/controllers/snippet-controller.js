import { Snippet } from '../models/snippet.js'

export class SnippetController {
    async createSnippet (req, res) {
        try {
            const snippet = new Snippet({
                username: req.session.username,
                message: req.body.message
            })
            await snippet.save()
            req.session.flash = { type: 'success', text: 'The snippet was created successfully.' }
            res.redirect('.')
        } catch (error) {
            req.session.flash = { type: 'failed', text: error.message }
            res.redirect('.')
        }
    }

    async renderIndex (req, res, next) {
        try {
            const viewData = {
                snippets: (await Snippet.find())
                    .map(snippet => ({
                        username: snippet.username,
                        message: snippet.message
                    }))
            }
            res.render('snippets/index', { viewData })
        } catch (error) {
            next(error)
        }
    }
}