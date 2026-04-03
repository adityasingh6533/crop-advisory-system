const User = require('../Models/user');
const { hashPassword, sanitizeUser, setUserToken, verifyPassword } = require('../service/auth');

const createUser = async (req, res) => {
    const body = req.body;
    const firstName = body.firstName?.trim();
    const lastName = body.lastName?.trim() || '';
    const email = body.Email?.trim().toLowerCase();
    const username = body.username?.trim();
    const password = body.password;

    if (!firstName || !email || !username || !password) {
        return res.status(400).json({ error: 'Required fields are missing' });
    }

    if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    try {
        const existingUser = await User.findOne({
            $or: [{ Email: email }, { Username: username }],
        });

        if (existingUser) {
            if (existingUser.Email === email) {
                return res.status(409).json({ error: 'Email is already registered' });
            }

            return res.status(409).json({ error: 'Username is already taken' });
        }

        const hashedPassword = await hashPassword(password);

        const newUser = new User({
            FirstName: firstName,
            LastName: lastName,
            Email: email,
            Username: username,
            Password: hashedPassword,
        });

        await newUser.save();

        res.status(201).json({
            message: 'User created successfully',
            user: sanitizeUser(newUser),
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const signInUser = async (req, res) => {
    const body = req.body;
    const credential = body.credential?.trim();
    const normalizedEmail = credential?.toLowerCase();

    if (!credential || !body.password) {
        return res.status(400).json({ error: 'Email/Username and password are required' });
    }

    try {
        const user = await User.findOne({
            $or: [{ Username: credential }, { Email: normalizedEmail }],
        });

        if (!user) {
            return res.status(401).json({ error: 'User does not exist' });
        }

        const passwordMatches = await verifyPassword(body.password, user.Password);

        if (!passwordMatches) {
            return res.status(401).json({ error: 'Incorrect password' });
        }

        if (!user.Password.startsWith('scrypt:')) {
            user.Password = await hashPassword(body.password);
            await user.save();
        }

        const token = setUserToken(user);

        res.status(200).json({
            message: 'Sign-in successful',
            user: sanitizeUser(user),
            token,
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    createUser,
    signInUser,
};
