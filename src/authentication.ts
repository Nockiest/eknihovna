
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