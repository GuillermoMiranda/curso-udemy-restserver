const Role = require('../models/role');
const Usuario = require('../models/usuario')

const esRoleValido = async (rol = '')=>{
    const existeRol = await Role.findOne({rol});
    if (!existeRol){
        throw new Error (`el rol ${ rol } no esta registrado en la BD `)
    }
}

const emailExiste = async (correo) => {
    const existeMail = await Usuario.findOne( {correo});
    if( existeMail) {
        throw new Error (`el mail ${ correo } ya esta registrado en la BD `)
}
}

const existeUsuarioPorId = async (id) => {

    const existeUsuario = await Usuario.findById(id);
    if (!existeUsuario) {
        throw new Error(`el ID ${id} no existe`)
    }
}



module.exports = {esRoleValido,
                    emailExiste,
                    existeUsuarioPorId};