require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors")
const express = require("express");
const bcrypt = require('bcrypt');
const User = require('./models/user');
const Comment = require('./models/comment');
const Upload = require('./models/upload')
const app = express();
const PORT = process.env.PORT || 3500;
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

// database connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("Successful database connection!"))
    .catch((error) => console.log(error.message));

//COMMENT//
    app.post("/comment", async (req, res) => {
        const { username, comment ,imgId} = req.body;
    try {
        const newComment = new Comment({
            username,
            comment,
            imgId
        });
        
        await newComment.save();
        
        // Respond with a success message or data
        res.status(200).json({ message: "Comment successful" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get('/getComments/:imageId', async (req, res) => {
    const { imageId } = req.params;
    try {
        const Comments = await Comment.find({ imgId: imageId });
        if (!Comments) {
            return res.status(404).json({ error: 'No comments found' });
        }

        res.status(200).json(Comments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.delete('/deleteComment/:_id', async (req, res) => {
    const { _id} = req.params;

    try {
        const deletedComment = await Comment.findByIdAndDelete({_id})
        
        if (!deletedComment) {
            return res.status(404).json({ error: "Comment not found" });
        }
        
        res.status(200).json({ message: "Comment deleted successfully", deletedComment });
    } catch (error) {
        console.error("Error while deleting the comment:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})
    
    //FILE UPLOAD//
app.post("/upload", async (req, res) => {
        const { username, desc, img, id } = req.body;
    try {
        const newUpload = new Upload({
            username,
            desc,
            img,
            id
        });
        
        // Save the new upload to the database
        await newUpload.save();
        
        // Respond with a success message or data
        res.status(200).json({ message: "Upload successful" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


app.get('/getUserData/:username', async (req, res) => {
    const { username } = req.params;
  
    try {
      const user = await User.findOne({ username });
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.status(200).json({ user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

app.get('/uploads', async (req, res) => {
    try {
        const uploads = await Upload.find();
        res.status(200).json(uploads);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/uploads/:username', async (req, res) => {
    const { username } = req.params;
    
    try {
        // Lekérdezés a felhasználóhoz tartozó összes feltöltött képről
        const userUploads = await Upload.find({ username });

        // Válasz küldése a lekért képekkel
        res.status(200).json(userUploads);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.get('/getImageData/:imageId', async (req, res) => {
    const { imageId } = req.params;

    try {
        // Lekérdezés a képről az imageId alapján
        const imageDetails = await Upload.findOne({ id: imageId });

        // Ellenőrizzük, hogy van-e találat
        if (!imageDetails) {
            return res.status(404).json({ error: 'Image not found' });
        }

        // Válasz küldése a kép részleteivel
        res.status(200).json(imageDetails);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.delete("/uploads/:uploadId", async (req, res) => {
    const { uploadId } = req.params;
    
    try {
        // Find the upload by ID and remove it
        const deletedUpload = await Upload.findOneAndDelete({ id: uploadId });
        
        
        if (!deletedUpload) {
            return res.status(404).json({ error: "Upload not found" });
        }
        
        res.status(200).json({ message: "Upload deleted successfully", deletedUpload });
    } catch (error) {
        console.error("Error while deleting the upload:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


//REGISTRATION//
app.post("/register", async (req, res) => {
    const { username, password, email,} = req.body;
    
    try {
        const checkUsername = await User.findOne({ username });
        const checkEmail = await User.findOne({ email });
        if (checkUsername) {
            res.json("username exists");
        }
        else if(checkEmail) {
            res.json("email exists")
        } 
        else {

            const hashedPassword = await bcrypt.hash(password, 10)
            
            const newUser = new User({
                username,
                password: hashedPassword,
                email,
            });
            await newUser.save();
            res.json("notexists");
        }
    } catch (error) {
        console.error(error);
        res.status(500).json("error"); // Send an error response
    }
});

//LOGIN//

app.post("/login", async (req, res) => {
    const { emailOrUsername, password } = req.body;
    try {
        let user = await User.findOne({ email : emailOrUsername, });
        if (!user) {
            user = await User.findOne({username : emailOrUsername})
            if (!user) {
                res.status(404).json("notfound");
                console.log("Notfound")
                return;
            }
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (isPasswordValid) {
                res.status(200).json({ success: true, user });
                return;
            } else {
                res.status(401).json("incorrect");
                return;
            }
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
            if (isPasswordValid) {
                res.status(200).json({ success: true, user });
            } else {
                res.status(401).json("incorrect");
            }
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occured" });
        console.log("error")
        
    }
});

// UPDATING A USER //
app.put("/updateUser/:username", async (req, res) => {
    const { username } = req.params;
    const updatedUser = req.body;
    
    try {
        
        if (updatedUser.password) {
        const hashedPassword = await bcrypt.hash(updatedUser.password, 10);
        updatedUser.password = hashedPassword;
      }

      if (updatedUser.pfp) {
          updatedUser.pfp = updatedUser.pfp;
        }
        
      const savedUser = await User.findOneAndUpdate(
          { username },
          updatedUser,
          { new: true }
      );
      
      if (!savedUser) {
          return res.status(404).json({ error: "User does not exist" });
        }
  
        res.status(200).json(savedUser);
    } catch (error) {
        console.error("Error while updating the user:", error);
        res.status(500).json({ error: "An error occured" });
    }
});

//SERVER LISTENING//
app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});
