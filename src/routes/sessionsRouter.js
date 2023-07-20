import { Router } from 'express';
import userModel from '../dao/models/usersModel.js';
import { createHash, isValidPassword } from '../utils.js';
import passport from 'passport';

const router = Router();

router.post('/register', async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;
    const exists = await userModel.findOne({ email });
    if (exists) return res.status(400).send({ status: "error", error: "User already exists" });
    let user = {
        first_name,
        last_name,
        email,
        age,
        password:createHash(password)
    }
    let result = await userModel.create(user);
    res.send({ status: "success", message: "User registered" });
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) return res.status(400).send({ status: "error", error: "Incorrect credentials" });
    if(!isValidPassword(user,password)) return res.status(403).send({status:"error", error:"Password incorrecta"});
    delete user.password;
    req.session.user = {
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        age: user.age,
        admin: user.admin
    }
    res.send({ status: "success", payload: req.session.user, message: "¡Primer logueo realizado! :)" });
})

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).send({ status: "error", error: "Couldn't logout" });
        res.redirect('/login');
    })
})

router.get('/github', passport.authenticate('github', {scope: ['user:email']}), async (req, res) => {});

router.get('/githubcallback', passport.authenticate('github', {failureRedirect: '/login'}), async (req, res) =>{
    req.session.user = req.user;
    res.redirect('/')
});

export default router;