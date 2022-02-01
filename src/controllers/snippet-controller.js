import { Snippet } from '../models/snippet.js'

/**
 * The snippet controller.
 */
export class SnippetController {
  /**
   * Creates a snippet.
   *
   * @param {object} req - Express req object.
   * @param {object} res - Express res object.
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
   * Checks if the current user is the owner.
   *
   * @param {object} req - Express req object.
   * @param {object} snippet - Snippet object.
   * @returns {boolean} - True if it is the owner and false if not.
   */
  static checkIfCreatedByThisUser (req, snippet) {
    if (req.session.username === snippet.username) {
      return true
    } else {
      return false
    }
  }

  /**
   * Renders the delete page.
   *
   * @param {object} req - Express req object.
   * @param {object} res - Express res object.
   * @param {Function} next - Express next middleware function.
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
   * Deletes a snippet.
   *
   * @param {object} req - Express req object.
   * @param {object} res - Express res object.
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
   * Renders the edit page.
   *
   * @param {object} req - Express req object.
   * @param {object} res - Express res object.
   * @param {Function} next - Express next middleware function.
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
   * Edits a snippet.
   *
   * @param {object} req - Express req object.
   * @param {object} res - Express res object.
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
   * Renders index, all snippets.
   *
   * @param {object} req - Express req object.
   * @param {object} res - Express res object.
   * @param {Function} next - Express next middleware function.
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
   * Authorizes.
   *
   * @param {object} req - Express req object.
   * @param {object} res - Express res object.
   * @param {Function} next - Express next middleware function.
   * @returns {Function} Express next middleware function.
   */
  async auth (req, res, next) {
    const snippet = await Snippet.findOne({ _id: req.params.id })
    // If the user is anonymous, throw 404.
    if (!req.session.username) {
      const error = new Error('Not found')
      error.status = 404
      return next(error)
    // If another user tries to access someone elses snnippet throw 403.
    } else if (req.params.id && (snippet.username !== req.session.username)) {
      const error = new Error('Forbidden')
      error.status = 403
      return next(error)
    }
    next()
  }
}
