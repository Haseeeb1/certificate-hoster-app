const express = require("express");
const Certificate = require("../models/Certificate");
const User = require("../models/User");
const router = express.Router();
const { v2: cloudinary } = require("cloudinary");
const axios = require("axios");
const authMiddleware = require("../middleware/AuthMiddleware");

// Create a new certificate

router.post("/generate/certificate", async (req, res) => {
  try {
    const { data, formData } = req.body;
    const { name, title, hashtags, dateSelected, message, userId } =
      formData || null;
    // Upload the image to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(data, {
      folder: "certificates", // Specify a folder if you like
    });

    // Create a new certificate with the uploaded image URL
    const certificate = new Certificate({
      name,
      title,
      hashtags,
      dateSelected,
      message,
      imageUrl: uploadResponse.secure_url,
    });

    // Save the certificate to the database
    await certificate.save();

    // If a user ID is provided, associate the certificate with the user
    if (userId) {
      const user = await User.findById(userId);
      if (user) {
        user.certificates.push(certificate._id);
        await user.save();
      }
    }

    // Return the certificate details along with the URL and image URL
    res.status(201).json(certificate._id);
  } catch (error) {
    console.error("Error generating the certificate:", error);
    res.status(500).json({ error: "Error generating the certificate" });
  }
});


router.get("/certificate/:id", async (req, res) => {
  const certificateId = req.params.id;

  try {
    // Fetch certificate data from your database
    const certificateData = await Certificate.findById(certificateId);

    if (!certificateData) {
      // If no certificate found, return a 404 error
      return res.status(404).json({
        success: false,
        message: "Certificate not found",
      });
    }

    // Generate secure Cloudinary URL without any transformations
    const secureImageUrl = cloudinary.url(certificateData.imageUrl, {
      secure: true,
      sign_url: true,
    });

    // Fetch the image from Cloudinary
    const imageResponse = await axios.get(secureImageUrl, {
      responseType: "arraybuffer",
    });

    // Send the image data as a base64 encoded string
    const imageData = Buffer.from(imageResponse.data, "binary").toString(
      "base64"
    );

    certificateData.imageUrl = null;
    // Respond with the certificate data and the base64 encoded image
    res.json({
      success: true,
      ...certificateData.toObject(),
      imageData: `data:${imageResponse.headers["content-type"]};base64,${imageData}`,
    });
  } catch (error) {
    console.error("Error fetching certificate:", error);

    // Return a 500 Internal Server Error if something goes wrong
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching the certificate",
    });
  }
});


router.post('/user/:id/certificates',authMiddleware, async (req, res) => {
  try {
    const userId = req.params.id;
    // Find the user by ID and populate the certificates array
    const user = await User.findById(userId).populate({
      path: 'certificates',
      options: { limit: 20
       },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.certificates.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No certificates found",
        certificates: [],
      });
    }

      const certificates = await Promise.all(user.certificates.map(async (certificate) => {
      // Generate secure Cloudinary URL
      const secureImageUrl = cloudinary.url(certificate.imageUrl, {
        secure: true,
        sign_url: true,
      });

      // Fetch the image from Cloudinary
      const imageResponse = await axios.get(secureImageUrl, {
        responseType: 'arraybuffer',
      });

      // Convert the image to a base64 encoded string
      const imageData = Buffer.from(imageResponse.data, 'binary').toString('base64');

      // Return the certificate data with the image in base64 format
      return {
        ...certificate.toObject(),
        imageUrl: null, // Set the imageUrl to null
        imageData: `data:${imageResponse.headers['content-type']};base64,${imageData}`,
      };
    }));

    // Respond with the certificates array
    res.json({
      success: true,
      certificates,
    });
  } catch (error) {
    console.error('Error fetching certificates:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching certificates',
    });
  }
});

module.exports = router;
