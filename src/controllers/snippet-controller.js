import { Snippet } from '../models/snippet.js'

/**
 *
 */
export class SnippetController {
  /**
   * @param req
   * @param res
   */
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

  /**
   * @param req
   * @param snippet
   */
  static checkIfCreatedByThisUser (req, snippet) {
    if (req.session.username === snippet.username) {
      return true
    } else {
      return false
    }
  }

  /**
   * @param req
   * @param res
   * @param next
   */
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

  /**
   * @param req
   * @param res
   */
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

  /**
   * @param req
   * @param res
   * @param next
   */
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

  /**
   * @param req
   * @param res
   */
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

  /**
   * @param req
   * @param res
   * @param next
   */
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

  /**
   * @param req
   * @param res
   * @param next
   */
  async auth (req, res, next) {
    const snippet = await Snippet.findOne({ _id: req.params.id })
    if (!req.session.username) {
      const error = new Error('Not found')
      error.status = 404
      return next(error)
    } else if (req.params.id && (snippet.username !== req.session.username)) {
      const error = new Error('Forbidden')
      error.status = 403
      return next(error)
    }
    next()
  }
}
