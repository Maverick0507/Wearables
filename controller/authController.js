import userModel from "../model/userModel.js"
import orderModel from '../model/orderModel.js'
import JWT from 'jsonwebtoken'
import { hashPassword, comparePassword } from '../helper/authHelper.js'

export const registerController = async (req, res) => {
    try {

        const { name, email, password, phone, address, answer } = req.body
        // validation
        if (!name || !phone || !password || !address || !answer || !email) {
            return res(400).send({
                message: "Please provide all required details"
            })
        }

        // existing user
        const existingUser = await userModel.findOne({ email })
        if (existingUser) {
            return res(400).send({
                message: "User already exist "
            })
        }

        const hashedPassword = await hashPassword(password)
        const user = await new userModel({
            name,
            password: hashedPassword,
            email,
            answer,
            phone,
            address
        }).save()
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user,
        });



    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: "An error occured while registeration"
        })
    }
}



// login controller


export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        // validation
        if (!email || !password) {
            return res.status(400).send({
                success: false,
                message: "Invalid email or password",
            });
        }

        // check user
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "Email is not registered",
            });
        }

        const match = await comparePassword(password, user.password);
        if (!match) {
            return res.status(401).send({
                success: false,
                message: "Invalid Password",
            });
        }

        // Generate token
        const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        // Set the token as a cookie
        res.cookie('token', token, { httpOnly: true, expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });


       

        res.status(200).send({
            success: true,
            message: "Login successful",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role,
            },
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in login",
            error,
        });
    }
};





// logout
export const logoutController = async (req, res) => {
    try {
        res.cookie('token', '', {
            httpOnly: true,
            expires: new Date(0), // Set the expiration to a past date to delete the cookie
        });
        res.status(200).send({
            success: true,
            message: "Logout successfully"
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in log out",
            error,
        });
    }
};




// update profile
export const updateProfileController = async (req, res) => {
    try {
        const { name, address, email, phone, password, answer } = req.body;
        const user = await userModel.findOne({ email });

        if (password && password.length < 6) {
            return res.status(400).json({ error: 'Password is required and should be at least 6 characters long' });
        }

        const hashedPassword = password ? await hashPassword(password) : undefined;

        const updateUser = await userModel.findOneAndUpdate(
            { email },
            {
                $set: {
                    name: name || user.name,
                    password: hashedPassword || user.password,
                    phone: phone || user.phone,
                    address: address || user.address,
                }
            },
            { new: true } // To return the updated user object
        );

        res.status(200).send({
            success: true,
            message: 'Profile updated successfully',
            updateUser,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Something went wrong in updating the profile',
            error,
        });
    }
};



// forget password
export const forgotPasswordController = async (req, res) => {
    try {
        const { email, answer, newPassword } = req.body;
        if (!email) {
            res.status(400).send({ message: "Emai is required" });
        }
        if (!answer) {
            res.status(400).send({ message: "answer is required" });
        }
        if (!newPassword) {
            res.status(400).send({ message: "New Password is required" });
        }
        const user = await userModel.findOne({ email, answer });
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "Wrong Email Or Answer",
            });
        }
        const hashedPassword = await hashPassword(newPassword);
        await userModel.findByIdAndUpdate(user._id, { password: hashedPassword });
        res.status(200).send({
            success: true,
            message: "Password Reset Successfully",
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Something went wrong",
            error,
        });
    }
}




// testing
export const testController = async (req, res) => {
    res.send("done")
}


export const privateRouteController = async (req, res) => {
    res.status(200).send({ ok: true });
}


// user order
export const OrderController = async (req, res) => {
    try {
        const { uid } = req.params
        console.log(uid)
        const orders = await orderModel
            .find({ buyer: uid })
            .populate("products", "-photos")
            .populate("buyer", "name")
            .sort({ createdAt: '-1' })
        res.json(orders)
    } catch (error) {
        res.status(500)
            .send({
                success: false,
                message: "Error while getting order",
                error
            })
    }
}


// admin order
export const allOrderCOntroller = async (req, res) => {
    try {
        const orders = await orderModel
            .find({})
            .populate("products", "-photos")
            .populate("buyer", "name")
            .sort({ createdAt: '-1' })
        res.json(orders)
    } catch (error) {
        res.status(500)
            .send({
                success: false,
                message: "Eroor while getting order",
                error
            })
    }
}



// order status
export const orderStatusController = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        console.log(orderId)
        const order = await orderModel.findByIdAndUpdate(orderId, { status }, { new: true });


        res.json(order);
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({
            success: false,
            message: "Error while updating order",
            error: error.message, // Include the error message in the response
        });
    }
}
