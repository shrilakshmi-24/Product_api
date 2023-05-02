const userController=require('../controllers/userController.js')
const router=require('express').Router()
const auth=require('../middlewares/auth.js')
const authorization=require('../middlewares/authentication.js')


router.post('/users',auth,authorization,userController.addUser)

router.post('/users/signin',userController.signIn)

router.get('/users',auth,authorization,userController.getAllUsers)

router.get('/users/:id',auth,authorization,userController.getSingleUser)

router.put('/users/:id',auth,authorization,userController.updateUser)

router.delete('/users/:id',auth,authorization,userController.deleteUser)

router.get('/users-csv', auth,authorization,userController.createUsersCsv);




module.exports=router
