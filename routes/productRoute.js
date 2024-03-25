import express from 'express';
import formidable from 'express-formidable'
import { braintreePaymentController, braintreeTokenController, createProductController, deleteProductController, getLimitedProductController, getPhotoController, getProductController, getSingleProductController, productByCategory, searchProductController, updateProductController } from '../controller/productController.js';
import { isAdmin, requireSignIn } from '../middleware/authMiddleware.js';

const router = express.Router();

// create product
router.post('/create-product', formidable(),createProductController)
// get all product 
router.get('/get-product',getProductController)
// get limited product 
router.get('/get-product/limited',getLimitedProductController)
// get single product
router.get('/single-product/:slug',getSingleProductController)
// get photo
router.get('/get-photo/:pid',getPhotoController)
// delete product
router.delete('/delete-product/:pid',deleteProductController)
// update product
router.put('/update-product/:productId',formidable(),updateProductController)
// filter product
router.get('/category-products/:id',productByCategory)
// search route
router.get('/search/:keyword',searchProductController)
// payemnt route
// token
router.get('/braintree/token', braintreeTokenController)
// payments
router.post('/braintree/payment', braintreePaymentController)
export default router;
