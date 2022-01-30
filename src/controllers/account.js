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
            res.redirect('..')
        } catch (error) {
            req.session.flash = { type: 'failed', text: error.message }
        }
    }

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
            req.session.flash = { type: 'failed', text: error.message }
            res.redirect('./login')
        }
    }

    async renderRegister (req, res) {
            res.render('account/register')
    }

    async renderLogin (req, res) {
        res.render('account/login')
    }

    // Better solution to this and logincheck?
    anonymousCheck (req, res, next) {
        if (!req.session.username) {
            next()
        } else {
            // create error?
            res.redirect('..')
        }
    }

    loggedInCheck (req, res, next) {
        if(req.session.username) {
            next()
        } else {
            // create error?
            res.redirect('..')
        }
    }

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