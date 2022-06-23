const express = require('express');
const router = express.Router();
const User = require('../models/user');
const CrytoJS = require('crypto-js'); 
const jwt = require('jsonwebtoken');
//const dotenv = require('dotenv');
//const { verifyToken, verifyTokenAndAdmin } = require('../verifyToken')
const verifyToken = require('../verifyToken')
const Room = require('../models/room'); 

require('dotenv').config()

router.post('/register', async function (req, res) {
    try {

        const emailExists = await User.findOne({ email: req.body.email });
        console.log(emailExists)
        if (emailExists) {
            return res.status(403).json({ "msg": "email exists" })  
        } else {
            const user = new User({
                email: req.body.email,
                password: CrytoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString(),
                isAdmin: req.body.isAdmin
            });

            await user.save();
            res.status(200).json({ "msg": "user created succcesfully" })
        }

        

    } catch (e) {
        res.status(500).json({ "msg": "server side error"})
    }

}); 

router.post('/login', async function (req, res) {

    //const user = req.body.email; 

    try {

        const user = await User.findOne({ email: req.body.email })

        if (!user) {
            return res.status(403).json({ "msg": "no such user exists" })
        } else {
            const originalPassword = await CrytoJS.AES.decrypt(user.password, process.env.PASS_SEC).toString(CrytoJS.enc.Utf8);
            if (originalPassword == req.body.password) {
                const accessToken = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.PASS_JWT, { expiresIn: "240s" });
                const { password, ...otherdetails } = user._doc;
                res.status(200).json({ "msg": "login successful", "accessToken": accessToken, otherdetails })
            } else {
                res.status(403).json({ "msg": "passwords do not match" })
            }

        }
    } catch (e) {
        console.log(e)
        res.status(500).json({e})
    }

    

});



router.get('/profile/:id', verifyToken, async function (req, res) {
    try {
        console.log(req.user)
        console.log(req.params.id)

        const user = await User.findById(req.params.id); 

        //console.log(user)


        res.status(200).json({ "msg": "you are authorized to acccss your profile", user})
    } catch (e) {
        res.status(500).json({"msg":"server error"})
    }
})


router.put('/profile/:id', verifyToken, async function (req, res) {
    try {
        console.log(req.user)
        console.log(req.params.id)

        const user = await User.findByIdAndUpdate(req.params.id, (req.body), { new: true });

        res.status(200).json({ "msg": "email updated successfully"})
    } catch (e) {
        res.status(500).json({ "msg": "server error" })
    }
})



/***********************Room Routes***************************************************/

router.get('/rooms', async function (req, res) {
    try {
        const rooms = await Room.find({});
        res.status(200).json({"msg":rooms})
    } catch (e) {
        res.status(500).json({"msg": "server side error"})
    }
})


router.post('/addrooms', verifyToken, async function (req, res) {
    try {
        const room = new Room(req.body); 
        await room.save(); 
        res.status(200).json({"msg": "room addded successfully"})
    } catch (e) {
        console.log(e)
        res.status(500).json({"msg": "server error"})
    }
})

router.delete('/deleteroom/:id', verifyToken, function (req, res) {
    try {
        //const id = req.params.id;
        Room.findByIdAndDelete(req.params.id, (err, docs) => {
            if (err) {
                console.log(err)
            } else {
                console.log(docs)
            }
        });
        res.status(200).json({"msg": "room deleted successfully"})

    } catch (e) {
        console.log(e)
        res.status(500).json({"msg": "server error"})
    }
})

router.get('/getroom/:id', verifyToken, async function (req, res) {
    try {
        console.log(req.params.id);
        const room = await Room.findById(req.params.id);
        console.log(room)
        res.status(200).json({room})

    } catch (e) {
        console.log(e)
        res.status(500).json({"msg": "server error"})
    }
    

})

router.put('/editroom/:id', async function (req, res) {
    console.log(req.params.id)
    const id = req.params.id;

    try {
        const updatedroom = await Room.findByIdAndUpdate({ _id: id }, (req.body), { new: true }); 
        res.status(200).json({"msg": "room updated successfully"})
    } catch (e) {
        console.log(e);
        res.status(500).json({"msg": "server error"})
    }
})



module.exports = router; 