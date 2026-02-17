const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const basicAuth = async (req, res, next) => { 
const authHeader = req.headers['authorization']; 
if (!authHeader) { 
req.user = null;
return next();
}

// 1. Parse authHeader to extract the username and password
const base64Credentials = authHeader.split(' ')[1];
const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
const [username, password] = credentials.split(':');

// 2. Check the database for the user with matching username and password
const user = await prisma.user.findFirst({
    where: {
        username: username,
        password: password
    }
});

// 3. If found, set req.user to it and allow the next middleware to run
if (user) {
    req.user = user;
    return next();
}

// 4. If not, immediate respond with status code 401
return res.status(401).json({ message: "Invalid credentials" });
}; 

module.exports = basicAuth;