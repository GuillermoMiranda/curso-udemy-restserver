const {Schema, model} = require('mongoose');

const UsurarioSchema = Schema ({

    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true 
    },
    password: {
        type: String,
        required: [true, 'La contrasena es obligatoria'],
    },
    img: {
        type: String,
    },
    rol: {
        type: String,
        required: true,
        emun: ['ADMIN_ROLE', 'USER_ROLE']
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    },
});

//Al momneto de crear el modelo puedo crear metodos o modificar metodos existentes del modelo.
//Aca lo que se hace es desestructurar los campos, sacando los campos __v y password para que esos no viajen en el JSON que me devuelve la base de datos. Es metodo se llama toJSON y se lo modifica

UsurarioSchema.methods.toJSON = function() {
    const { __v, password, _id, ...usuario} = this.toObject();
    usuario.uid = _id
    return usuario; //cuando desestrutura el objeto saco los campos que no quiero mostras y dejo el resto en usuario, que es el que retorno.
}

module.exports = model( 'Usuario' , UsurarioSchema)