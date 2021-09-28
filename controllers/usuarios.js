const {request, response} = require('express');
const Usuario = require('../models/usuario')
const bcrypt = require('bcrypt');

const usuariosGet = async (req = request , res = response) =>{

    const {limite = 5, desde = 0 } = req.query;
    const query = { estado: true};
    //const {q, nombre = 'no name', apikey} = req.query;
    /* const {limite = 5, desde = 0 } = req.query;
    const usuarios = await Usuario.find()
        .skip( Number(desde))
        .limit( Number(limite)); */
    
    const [total, usuarios ] = await Promise.all([//el Promise all con el await hace que hace que hasta que no se cumplan las prmesos incluidas en el array no avance. entonces busca los registros que cumplen el query (es decir que el estado sea TRUE), y los cuenta y muestra de acuerdo a lo definido como lmite y desde
        Usuario.countDocuments(query), //esta es la primer promesa, cuenta la cantidad de elementos en el modelo Usuario
        Usuario.find(query) //esta es la primer promesa que muestra (find) los registros que cumplen la query
            .skip( Number(desde))
            .limit( Number(limite))
    ]);
    
    res.json({
        total,
        usuarios
    });
}

const usuariosPut = async (req = request, res = response) =>{
    
    const id = req.params.id;
    const {password, google, correo, ...resto } = req.body; 
    
    //validar contra BD
    if (password) {

        //Encriptar la contrasena
        const saltos = bcrypt.genSaltSync();
        resto.password = bcrypt.hashSync( password, saltos);
    }
    
    const usuario = await Usuario.findByIdAndUpdate( id, resto);
    
    res.json({
    usuario
    });
}

const usuariosPost = async (req = request, res = response) =>{
    
    const {nombre, correo, password, rol} = req.body;
    const usuario = new Usuario({nombre, correo, password, rol});

    
    //Encriptar la contrasena
    const saltos = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync( password, saltos);


    //Guardar en BD
    await usuario.save();
    
    res.json({
    usuario
    });
}

const usuariosDelete = async (req, res = response) =>{
    
    const {id} = req.params;

    //fisicamente los borrados
    //const usuario = await Usuario.findByIdAndDelete( id ); //cuando llega al controlador ya paso por las validacione y se que el ID ya existe. aca se borrar el registro de la BD. eso no es recomendable, por eso no lo vamos a hacer aca

    //cambiamos esta del usuario, pasando a FALSE lo que no queremos que aparezcan mas, simulando que fueron eliminados.
    
    const usuario =  await Usuario.findByIdAndUpdate( id, {estado: false}); //aca estamos buscando el id que pasamos como primer parametro y para ese definimos el estado como false (update)
    
    res.json({
    usuario
    });
}

const usuariosPatch = (req = request, res = response) =>{
    res.json({
    msg: 'patch API - controlador'
    });
}


module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
    usuariosPatch
}