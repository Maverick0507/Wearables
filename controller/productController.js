import productModel from '../model/productModel.js'
import orderModel from '../model/orderModel.js'
import slugify from 'slugify';
import fs from 'fs'
import braintree from 'braintree'
import dotenv from 'dotenv'

dotenv.config()

// payment gateway
var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});


// create product
export const createProductController = async (req, res) => {
    try {
        const { name, colors, price, category, quantity, shipping, description, sizes } = req.fields
        const { photos } = req.files
        // Validation
        if (!name) return res.status(400).send({ error: 'Name is required' });
        if (!description) return res.status(400).send({ error: 'Description is required' });
        if (!price) return res.status(400).send({ error: 'Price is required' });
        if (!category) return res.status(400).send({ error: 'Category is required' });
        if (!quantity) return res.status(400).send({ error: 'Quantity is required' });

        if (photos && photos.size > 1000000) {
            return res.status(400).send({ error: 'Photo should be less than 1 MB in size' });
        }
        console.log("1")
        const product = new productModel(
            {
                name,
                description,
                price,
                category,
                quantity,
                shipping,
                colors: colors.split(',').map(color => color.trim()),
                sizes: sizes.split(',').map(size => size.trim()),
                slug: slugify(name),
            }

        )
        console.log("2")

        if (photos) {
            product.photos.data = fs.readFileSync(photos.path);
            product.photos.contentType = photos.type;
        }
        console.log('3')

        await product.save()
        res.status(201).send({
            success: true,
            message: "Product create successfuly",
            product,
        })

    } catch (error) {

        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in creating product',
            error,
        });
    }
}



// get product
export const getProductController = async (req, res) => {
    try {

        const product = await productModel.find({}).select("-photo").sort({ createdAt: -1 }).populate('category').lean()
        res.status(201).send({
            success: true,
            total: product.length,
            message: 'All Product getting successfully',
            product,

        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in getting product',
            error,
        });
    }
}


// get product
export const getLimitedProductController = async (req, res) => {
    try {

        const product = await productModel.find({}).select("-photo").populate('category').lean().limit(12)
        res.status(201).send({
            success: true,
            total: product.length,
            message: 'All Product getting successfully',
            product,

        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in getting product',
            error,
        });
    }
}





// get single product
export const getSingleProductController = async (req, res) => {
    try {
        const { slug } = req.params
        const product = await productModel.findOne({ slug }).select("-photo").populate('category')
        if (!product) {
            return res.status(404).send({
                success: false,
                message: 'Product not found',
            });
        }

        res.status(201).send({
            success: true,
            message: 'Product getting successfully',
            product,

        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in getting product',
            error,
        });
    }
}


// get photo
export const getPhotoController = async (req, res) => {
    try {
        const { pid } = req.params
        const product = await productModel.findById(pid).select("photos")
        if (product.photos.data) {
            res.set('Content-type', product.photos.contentType)
            return res.status(200).send(product.photos.data)
        }

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in getting product photo',
            error,
        });
    }
}





// delete product
export const deleteProductController = async (req, res) => {
    try {
        const { pid } = req.params
        await productModel.findByIdAndDelete(pid)

        res.status(200).send({
            success: true,
            message: "Product Deleted successfully",
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error while deleting product',
            error,
        });
    }
}





// update product

// update product 
export const updateProductController = async (req, res) => {
    try {
        const { name, description, colors, price, quantity, shipping } = req.fields;
        const { photos } = req.files;

        console.log("1")

        // Validation
        if (!name) return res.status(400).send({ error: 'Name is required' });
        if (!description) return res.status(400).send({ error: 'Description is required' });
        if (!price) return res.status(400).send({ error: 'Price is required' });
        if (!quantity) return res.status(400).send({ error: 'Quantity is required' });



        if (photos && photos.size > 1000000) {
            return res.status(400).send({ error: 'Photo should be less than 1 MB in size' });
        }

        const colorsArray = colors.split(',').map(color => color.trim());

        const { productId } = req.params
        const product = await productModel.findByIdAndUpdate(productId,
            { ...req.fields, colors: colorsArray, slug: slugify(name) }, { new: true });

        if (photos) {
            product.photos.data = fs.readFileSync(photos.path);
            product.photos.contentType = photos.type;
        }

        await product.save();
        res.status(201).send({
            success: true,
            message: 'Product updated successfully',
            product,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in updating  product',
            error,
        });
    }
}




// product By Category

export const productByCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await productModel.find({ category: id }); // 
        res.status(200).send({
            success: true,
            product,
        });
    } catch (error) {
        console.error(error);
        res.status(400).send({
            success: false,
            message: "Error while getting products by category",
            error,
        });
    }
};



// search product
export const searchProductController = async (req, res) => {
    try {
        const { keyword } = req.params;
        const product = await productModel
            .find({
                $or: [
                    { name: { $regex: keyword, $options: 'i' } },
                    { description: { $regex: keyword, $options: 'i' } },
                ],
            })
            .select("-photo");

        res.status(201).send({
            success: true,
            message: 'Product fetched successfully by search',
            product,
        });
    } catch (error) {
        console.error("Error in search product:", error);
        res.status(500).send({
            success: false,
            message: "Error in searching products",
            error: error.message,
        });
    }
};




// payment gateway api



// payment gateway api
export const braintreeTokenController = async (req, res) => {
    try {
        gateway.clientToken.generate({}, function (err, response) {
            if (err) {
                res.status(500).send(err)
            }
            else {
                res.send(response)
            }
        })
    } catch (error) {
        console.log(error)
    }
}

// payment
// payment
export const braintreePaymentController = async (req, res) => {
    try {
        const { cart, nonce,id } = req.body;

        let total = 0;
        cart.forEach((item) => {
            total += item.price;
        });

        // Determine the buyer value based on authentication status
        const buyer = req.user ? req.user._id : null; // Use null for unauthenticated user
        

        // Create a new transaction using the gateway
        gateway.transaction.sale({
            amount: total.toFixed(2),
            paymentMethodNonce: nonce,
            options: {
                submitForSettlement: true,
            },
        }, async (error, result) => {
            if (result && result.success) {
                try {
                    // If the transaction is successful, create and save the order
                    const order = new orderModel({
                        products: cart,
                        payment: result.transaction,
                        buyer: id,
                    });
                    await order.save();
                    // Respond with success message or order ID
                    res.status(200).json({ message: 'Order placed successfully', orderId: order._id });
                } catch (saveError) {
                    res.status(500).json({ error: 'Failed to save order' });
                }
            } else {
                res.status(500).json({ error: error ? error.message : 'Transaction failed' });
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An unexpected error occurred' });
    }
};

