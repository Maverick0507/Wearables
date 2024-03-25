import jwt from 'jsonwebtoken';
import userModel from '../model/userModel.js'; // Import your userModel

// Protected route token based
export const requireSignIn = (req, res, next) => {
    try {
        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).send({
                success: false,
                message: "Unauthorized: Token missing",
            });

        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).send({
            success: false,
            message: "Unauthorized: Invalid token",
        });
    }
};
// Admin access
export const isAdmin = async (req, res, next) => {
    try {
        const user = await userModel.findById(req.user._id);

        if (!user) {
            return res.status(404).send({
                success: false,
                message: "User not found",
            });
        }

        if (user.role !== 1) {
            return res.status(403).send({
                success: false,
                message: "Unauthorized: Admin access required",
            });
        }

        next();
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Internal Server Error",
            error: error.message, // Sending only the error message
        });
    }
};
