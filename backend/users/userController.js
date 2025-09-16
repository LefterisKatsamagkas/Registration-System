import User from '../users/userModel.js';
import { generateToken } from '../utils/generateToken.js';

//@desc Auth user & get token
//@route POST/api/users/login
//@access Public 

const authUser = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (user && (await user.matchPassword(password))) {
        generateToken(res, user._id);

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
        });
     } else {
        res.status(401).json({ message: "Invalid email or password" });
    }
};
 
//@desc Register user 
//@route POST/api/users
//@access Public 

const registerUser = async (req, res) => {
    console.log("1");
    const { name, email, password } = req.body;

    console.log({ name, email, password });

    const userExists = await User.findOne({ email });

    if (userExists){
        res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
        name,
        email,
        password
    });

    if (user){
        generateToken(res, user._id);
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        });
    } else {
        res.status(201).json({ message: "Invalid user data" });
    }
};  

//@desc Logout user / clear cookie
//@route POST/api/users/logout
//@access Private 

const logoutUser = async (req, res) => {
    res.clearCookie('jwt', {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
    });
    res.status(200).json({ message: "You logged out successfully" });
};

//@desc Get user profile
//@route POST/api/users/profile
//@access Public 

const getUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        });
    } else {
        res.status(404).json({ message: "User not found" });
    }
};

//@desc Update user profile
//@route PUT/api/users/logout
//@access Private 

const updateUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        if (req.body.password) {
            user.password = req.body.password;
        } 
        
        const updatedUser = await user.save();

        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
        });
    } else {
        res.status(201).json({ message: "User not found" });
    }
};

//@desc Get users
//@route GET/api/users
//@access Private/Admin 

const getUsers = async (req, res) => {
    res.send('get users');
};

//@desc Get user by ID
//@route GET/api/users/:id
//@access Private/Admin 

const getUserByID = async (req, res) => {
    res.send('get user by id');
};

//@desc Delete user
//@route DELETE/api/users/:id
//@access Private/Admin 

const deleteUser = async (req, res) => {
    res.send('delete user');
};

//@desc Update users
//@route PUT/api/users/:id
//@access Private/Admin 

const updateUser = async (req, res) => {
    res.send('update users');
};

export {
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    getUsers,
    deleteUser,
    getUserByID,
    updateUser
};