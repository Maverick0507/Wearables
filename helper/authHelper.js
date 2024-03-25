import bcrypt from 'bcrypt'
import JWT from "jsonwebtoken"

export const hashPassword = async(password) =>
{
    try {
         const saltRound = 10
         const hashedPassword = await bcrypt.hash(password,saltRound)
         return hashedPassword
    } catch (error) {
        console.log(error)
    }
}

 


export const comparePassword = async (password, hashPassword) => {
    return bcrypt.compare(password, hashPassword);
  };