const Apprenant = require('C:/pfe/backend/models/Apprenant.js')
const Admin = require('C:/pfe/backend/models/Admin.js')
const Formateur = require('C:/pfe/backend/models/Formateur.js')

const jwt = require('jsonwebtoken')

require('dotenv').config()

//signup admin
module.exports.signUpAdmin = async (req, res, next) => {
  try {
    let admin = new Admin(req.body)

    await admin.save()
    res.status(201).json({ message: 'Admin created success' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server  Error' })
  }

}

//signin admin

exports.signInAdmin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isPasswordValid = await admin.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { userId: admin._id },
            `${process.env.ACCESS_TOKEN_SECRET}`,
            { expiresIn: "1h" }
        );

        res.json({
            success: true,
            token: token,
            admin
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


//edit profile admin
module.exports.editProfile = async (req, res) => {
    try {
      const updatedUserData = req.body;
      const { id } = req.params;
  
      const admin = await Admin.findByIdAndUpdate(id, updatedUserData, {
        new: true
      });
  
      if (!admin) {
        return res.json('admin not found');
      }
  
      res.json(admin);
    } catch (error) {
      console.error('error updating admin profile', error);
      res.status(500).json({ message: 'internal server error' });
    }
  };
  