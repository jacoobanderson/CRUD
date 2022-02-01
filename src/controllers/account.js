import { User } from '../models/user.js'

/**
 *
 */
export class AccountController {
  /**
   * Registers a new user.
   *
   * @param {object} req - Express req object.
   * @param {object} res - Express res object.
   */
  async register (req, res) {
    try {
      const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
      })
      await user.save()
      req.session.flash = { type: 'success', text: 'Your account was created.' }
      res.redirect('..')
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message }
      res.redirect('./register')
    }
  }

  /**
   * Generates session and the user logs in.
   *
   * @param {object} req - Express req object.
   * @param {object} res - Express res object.
   * @param {Function} next - Express next middleware function.
   */
  async login (req, res, next) {
    try {
      const user = await User.authenticate(req.body.username, req.body.password)
      req.session.regenerate((err) => {
        if (err) {
          next(err)
        }
        req.session.username = user.username
        req.session.flash = { type: 'success', text: 'You are now logged in.' }
        res.redirect('..')
      })
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message }
      res.redirect('./login')
    }
  }

  /**
   * Renders the register page.
   *
   * @param {object} req - Express req object.
   * @param {object} res - Express res object.
   */
  async renderRegister (req, res) {
    res.render('account/register')
  }

  /**
   * Renders the login page.
   *
   * @param {object} req - Express req object.
   * @param {object} res - Express res object.
   */
  async renderLogin (req, res) {
    res.render('account/login')
  }

  /**
   * Checks if the user is anonomyous or not.
   *
   * @param {object} req - Express req object.
   * @param {object} res - Express res object.
   * @param {Function} next - Express next middleware function.
   */
  anonymousCheck (req, res, next) {
    if (!req.session.username) {
      next()
    } else {
      const error = new Error('Not Found')
      error.status = 404
      next(error)
    }
  }

  /**
   * Checks if the user is logged in or not.
   *
   * @param {object} req - Express req object.
   * @param {object} res - Express res object.
   * @param {Function} next - Express next middleware function.
   */
  loggedInCheck (req, res, next) {
    if (req.session.username) {
      next()
    } else {
      const error = new Error('Not Found')
      error.status = 404
      next(error)
    }
  }

  /**
   * Destroys the session cookie and logs the user out.
   *
   * @param {object} req - Express req object.
   * @param {object} res - Express res object.
   * @param {Function} next - Express next middleware function.
   */
  async logout (req, res, next) {
    req.session.destroy((error) => {
      if (error) {
        next(error)
      } else {
        res.redirect('..')
      }
    })
  }
}
