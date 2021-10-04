const Router = require('express')
const {check} = require('express-validator');

/* const {validarCampos} = require('../middlewares/validar-campos');
const { esAdminRole, tieneRol } = require('../middlewares/validar-roles');
const { validarJWT } = require('../middlewares/validar-jwt'); */

const {
    validarCampos,
    esAdminRoles,
    tieneRol,
    validarJWT
} = require('../middlewares'); 

const {esRoleValido, emailExiste, existeUsuarioPorId} = require('../helpers/db-validators');

const {usuariosGet, 
    usuariosPut, 
    usuariosPost,
    usuariosDelete, 
    usuariosPatch} = require('../controllers/usuarios');

const router = Router();

router.get('/', usuariosGet );

router.put('/:id',[
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('rol').custom( (rol) => esRoleValido(rol) ),
    validarCampos
], usuariosPut);

router.post('/', [
    check('nombre','El nombre es campo obligatorio').not().isEmpty(),
    check('password','Minimo de 6 caracteres').isLength( {min : 6}),
    check('correo', 'El correo no es valido').isEmail(),
    check('correo').custom( (correo) => emailExiste(correo)),       //aca valido si el mail ya esta en la base de datos
    //check('rol','No es un rol valido').isIn(['ADMIN_ROLE','USER_ROLE']),
    check('rol').custom( (rol) => esRoleValido(rol) ), //aca el callbak recibe un solo argumente y es el mismo que se manda, asi que todo lo que est[a entre parantesis podria ser solo esRoleValido sin nada mas, y seria lo mismo
    validarCampos
],usuariosPost);

router.delete('/:id', [
    validarJWT,
    //esAdminRole,
    tieneRol('ADMIN_ROLE', 'VENTAS_ROLE'),
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos

], usuariosDelete);

router.patch('/', usuariosPatch);

module.exports = router;