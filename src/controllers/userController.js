const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const UserModel = require('../models/userModel')

// Inscription de l'utilisateur
const registerUser = asyncHandler(async (req, res) => {
    // Recevoir les informations du body
    const { username, email, password } = req.body

    // Vérifier que tous les champs sont remplis
    if (!username || !email || !password) {
        res.status(400)
        throw new Error('Veuillez compléter tous les champs')
    }

    // Vérifier si l'utilisateur existe déjà
    const userExists = await UserModel.findOne({ email })
    if (userExists) {
        res.status(400)
        throw new Error('Cet utilisateur existe déjà')
    }

    // Hash du mot de passe
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Création de l'utilisateur
    const user = await UserModel.create({
        username,
        email,
        password: hashedPassword
    })

    // Retourner la réponse
    if (user) {
        res.status(201).json({
            _id: user.id,
            username: user.username,
            email: user.email,
            token: generateToken(user.id)
        })
    } else {
        res.status(400)
        throw new Error('Données invalides de l\'utilisateur')
    }
})

// Connexion de l'utilisateur
const loginUser = asyncHandler(async (req, res) => {
    // Recevoir les informations du body
    const { email, password } = req.body

    // Vérifier si l'email existe en BDD / Vérifier mot de passe OK
    const user = await UserModel.findOne({ email })
    if (user && (await bcrypt.compare(password, user.password))) {
        // Retour de réponse
        res.status(200).json({
            _id: user.id,
            username: user.username,
            email: user.email,
            token: generateToken(user.id)
        })
        console.log(`JWT_SECRET : ${process.env.JWT_SECRET}`);
    }
    else {
        res.status(400)
        throw new Error('Invalid credentials')
    }
})

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })
}

module.exports = {
    registerUser,
    loginUser,
}