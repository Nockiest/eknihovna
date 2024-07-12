"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const saltRounds = 10; // Adjust according to your security requirements
// Hashing a password
// bcrypt.hash('eknihovna', saltRounds, (err, hash) => {
//   if (err) {
//     console.error('Error hashing password:', err);
//     return;
//   }
//   console.log('Hashed password:', hash);
// });
// Comparing a password (e.g., during authentication)
// bcrypt.compare('user_input_password', hashFromDatabase, (err, result) => {
//   if (err) {
//     console.error('Error comparing passwords:', err);
//     return;
//   }
//   if (result) {
//     console.log('Passwords match!');
//   } else {
//     console.log('Passwords do not match.');
//   }
// });
// export const authenticate = (req: Request, res: Response, next: () => void) => {
//     const { password } = req.body;
//     if (!password) {
//       return res.status(400).json({ error: 'Password required' });
//     }
//     bcrypt.compare(password, process.env.UPLOAD_PASSWORD_HASHED, (err, result) => {
//       if (err || !result) {
//         return res.status(401).json({ error: 'Unauthorized' });
//       }
//       next();
//     });
//   };
const jose_1 = require("jose");
const secret = new TextEncoder().encode(process.env.JWT_SECRET);
function verifyToken(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = req.cookies.authToken;
        if (!token) {
            return res.status(401).json({ message: 'Missing token' });
        }
        try {
            // Decode the token without verifying it to access the payload
            const decodedToken = (0, jose_1.decodeJwt)(token);
            const currentTime = Math.floor(Date.now() / 1000); // Get current time in seconds
            // Check if the token has expired
            if (decodedToken.exp && decodedToken.exp < currentTime) {
                return res.status(401).json({ message: 'Token has expired' });
            }
            // Verify the token
            const { payload } = yield (0, jose_1.jwtVerify)(token, secret);
            if (typeof payload !== 'object' || payload.role !== 'admin') {
                return res.status(401).json({ message: 'Invalid token' });
            }
            // Attach user info to the request object
            req.user = payload;
            next();
        }
        catch (error) {
            console.error('Token verification error:', error);
            return res.status(401).json({ message: 'Invalid token' });
        }
    });
}
exports.default = verifyToken;
