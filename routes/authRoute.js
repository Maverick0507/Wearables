import express from 'express'
import {  OrderController, allOrderCOntroller, forgotPasswordController, loginController, logoutController, orderStatusController, privateRouteController, registerController, testController, updateProfileController } from '../controller/authController.js'
import { isAdmin, requireSignIn } from '../middleware/authMiddleware.js'

const router = express.Router()

//Register route
router.post('/register', registerController)
//Login route
router.post('/login', loginController)
//Logout route
router.get('/logout',logoutController)
// update profile route
router.put('/update-profile', updateProfileController)
// Forgot password
router.post('/forgot-password', forgotPasswordController)
//test route
router.get('/test',requireSignIn,testController)
//protected user route auth
router.get("/user-auth",requireSignIn,privateRouteController );
//  admin route
router.get("/admin-auth",requireSignIn,isAdmin,privateRouteController)
// user order
router.get('/user/all-orders/:uid',OrderController)
// admin all orders
router.get('/admin/all-orders',allOrderCOntroller)
// order ststus update
router.put("/order-status/:orderId",orderStatusController)


export default router