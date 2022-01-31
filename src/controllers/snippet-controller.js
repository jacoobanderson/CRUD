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
            req.session.flash = { type: 'danger', text: error.message }
            res.redirect('.')
        }
    }

  static checkIfCreatedByThisUser(req, snippet) {
        if (req.session.username === snippet.username) {
            return true
        } else {
            return false
        }
    }

    async renderDelete (req, res, next) {
        try {
            const snippet = await Snippet.findById(req.params.id)

            const viewData = {
                id: snippet._id
            }

            res.render('snippets/deleteSnippet', { viewData })
        } catch (error) {
            next(error)
        }
    }

    async delete (req, res) {
        try {
            await Snippet.findByIdAndDelete(req.body.id)
            req.session.flash = { type: 'success', text: 'The snippet has successfully been deleted' }
            res.redirect('..')
        } catch (error) {
            req.session.flash = { type: 'danger', text: error.message }
            res.redirect('./delete')
        }
    }

    async renderEdit (req, res, next) {
        try {
            const snippet = await Snippet.findById(req.params.id)
            const viewData = {
                id: snippet._id,
                message: snippet.message
            }
            res.render('snippets/editSnippet', { viewData })
        } catch (error) {
            next(error)
        }
    }

    async edit (req, res) {
        try {
            const snippet = await Snippet.findById(req.params.id)
            snippet.message = req.body.message
            await snippet.save()
            req.session.flash = { type: 'success', text: 'The snippet was edited successfully.' }
            res.redirect('..')
        } catch (error) {
            req.session.flash = { type: 'danger', text: error.message }
            res.redirect('.')
        }
    }

    async renderIndex (req, res, next) {
        try {
            const viewData = {
                snippets: (await Snippet.find())
                    .map(snippet => ({
                        username: snippet.username,
                        message: snippet.message,
                        createdByThisUser: SnippetController.checkIfCreatedByThisUser(req, snippet),
                        id: snippet._id
                    }))
            }
            res.render('snippets/index', { viewData })
        } catch (error) {
            next(error)
        }
    }
}