const { response } = require("express");


const esAdminRole = (req, res=response, next) => {

    //es una validacion interna que salta si quiero validar el rol del usuario antes de validar el token. por esto este middleware se llama despues de validar el token. Sino salta este error
    if (!req.usuario) {
        return res.status(500).json({
            msg: 'Se quiere verificar el rol sin validar el token primero'
        })
    }

    const {rol, nombre} = req.usuario // del req que viene del middleware anterior (que valida el token, verlo en la ruta de delete) desestructuro el rol y el nombre del usuario

    if (rol !== 'ADMIN_ROLE') {
        return res.status(401).json({
            msg: `${nombre} no es administrador - No puede hacer esto`
        })
    }

    next();
}

const tieneRol = ( ...roles ) =>{
    return (req, res=response, next) =>{
        if (!req.usuario) {
            return res.status(500).json({
                msg: 'Se quiere verificar el rol sin validar el token primero'
            })
        }   
    
        if( !roles.includes (req.usuario.rol)) {
        return res.status(501).json({
            msg: `El servicio requiere uno de los siguientes roles: ${roles}`
        })
        }

        next();
    }
}

module.exports = {esAdminRole,
                    tieneRol};