const {response} = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const generarJWT = require('../helpers/generar-jwt');

const login = async (req, res = response) => {

    const {correo, password} = req.body;

    try {

        //verificar si el mail existe
        const usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            return res.status(400).json({
                msg: 'Usuario o contrase;a incorrectos - correo'
            })
        }

        //verificar si el usuarios esta activo
        if (!usuario.estado) {
            return res.status(400).json({
                msg: 'Usuario o contrase;a incorrectos - estado: false'
            })
        }
        //verificar la constrasenia
        const validPassword = bcrypt.compareSync( password, usuario.password);// esto compara el password que estoy recibiendo como argumento con el password que hay en la base de datos (usuario.password)
        if (!validPassword){
            return res.status(400).json({
                msg: 'Usuario o contrase;a incorrectos - password'
            })
        }

        //generar el JWT
        const token = await generarJWT (usuario.id);

        res.json({
            usuario,
            token
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Hable con el administrador"
        })
    }

    
}

module.exports = {login};