import { User } from '../models/user.js'

export class AccountController {
    async register (req, res) {
        try {
            const user = new User({
                username: req.body.username,
                email: req.body.email,
                password: req.body.password
            })
            await user.save()
            req.session.flash = { type: 'success', text: 'Your account was created.' }
        } catch (err) {
            req.session.flash = { type: 'failed', text: err.message }
        }
    }

    async login (req, res, next) {
        try {
            const user = await User.auth(req.body.username, req.body.password)
            req.session.username = user.username
            req.session.flash = { type: 'success', text: 'You are now logged in.' }
        } catch (err) {
            req.session.flash = { type: 'failed', text: err.message }
        }
    }
}