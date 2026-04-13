const crypto = require('crypto');
const jsonwebtoken = require('jsonwebtoken');
const User = require('../Models/user');

const HASH_PREFIX = 'scrypt';
const SCRYPT_KEY_LENGTH = 64;

function getJwtSecret() {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error('JWT_SECRET is not configured on the backend');
    }

    return secret;
}

function sanitizeUser(user) {
    if (!user) {
        return null;
    }

    return {
        id: user._id,
        FirstName: user.FirstName,
        LastName: user.LastName,
        Email: user.Email,
        Username: user.Username,
    };
}

function hashPassword(password) {
    return new Promise((resolve, reject) => {
        const salt = crypto.randomBytes(16).toString('hex');

        crypto.scrypt(password, salt, SCRYPT_KEY_LENGTH, (error, derivedKey) => {
            if (error) {
                reject(error);
                return;
            }

            resolve(`${HASH_PREFIX}:${salt}:${derivedKey.toString('hex')}`);
        });
    });
}

async function verifyPassword(password, storedPassword) {
    if (!storedPassword) {
        return false;
    }

    if (!storedPassword.startsWith(`${HASH_PREFIX}:`)) {
        return password === storedPassword;
    }

    const [, salt, expectedHash] = storedPassword.split(':');

    if (!salt || !expectedHash) {
        return false;
    }

    return new Promise((resolve, reject) => {
        crypto.scrypt(password, salt, SCRYPT_KEY_LENGTH, (error, derivedKey) => {
            if (error) {
                reject(error);
                return;
            }

            const expectedBuffer = Buffer.from(expectedHash, 'hex');
            resolve(
                expectedBuffer.length === derivedKey.length &&
                crypto.timingSafeEqual(expectedBuffer, derivedKey)
            );
        });
    });
}

function setUserToken(user) {
    const payload = {
        id: user._id,   
        email: user.Email,
    };
    return jsonwebtoken.sign(payload, getJwtSecret(), { expiresIn: '1h' });
}

function getUserFromToken(token) {
    try {
        const decoded = jsonwebtoken.verify(token, getJwtSecret());
        return User.findById(decoded.id);
    } catch (error) {
        return null;
    }
}


module.exports = {
    hashPassword,
    verifyPassword,
    sanitizeUser,
    setUserToken,
    getUserFromToken
};
