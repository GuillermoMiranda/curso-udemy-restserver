const { request, response } = require('express');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario'); // con esto ya es suficiente para hacer la interaccion con la base de datos

const validarJWT = async (req = request, res = response, next) =>{

    const token = req.header('token'); //aca define como se debe llamar el header que traera el token

    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la peticion'
        })
    }


    try {
    // valida el token con la palabra secreta que tenemos el .env    
        const {uid} =  jwt.verify(token, process.env.SECRETORPRIVATEKEY)
        
        //leer usuario que corresponde al uid

        const usuario = await Usuario.findById (uid);

        //verifico que el usuario (uid) que se quiere borrar existe en la BD, si no existe salta
        if (!usuario) {
            return res.status(401).json({
                msg: 'Token no valido - usuario  no existe en DB'
            })
        }
        //verificar si el uid tiene estado true (el usuario que borra esta activo)
        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'token no valido - usuario con estado:false'
            })
        }
    
        req.usuario = usuario;
        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token no valido'
        })
    }

}

module.exports= {validarJWT};