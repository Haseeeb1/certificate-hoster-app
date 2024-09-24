const express = require("express");
const Certificate = require("../models/Certificate");
const User = require("../models/User");
const router = express.Router();
const { v2: cloudinary } = require("cloudinary");
const axios = require("axios");
const authMiddleware = require("../middleware/AuthMiddleware");

const { rateLimit } = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,

  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: "You can only make 10 generate/update requests per day.",
    });
  },
});

router.post("/generate/certificate", limiter, async (req, res) => {
  try {
    const { data, formData } = req.body;
    const { name, title, hashtags, dateSelected, message, userId } =
      formData || null;

    if (userId) {
      const user = await User.findById(userId);
      if (user && user.certificates.length >= 15) {
        return res.status(400).json({
          error:
            "Certificate limit for account reached, delete previous to create a new one.",
        });
      }
    }
    const uploadResponse = await cloudinary.uploader.upload(data, {
      folder: "certificates",
    });

    const certificate = new Certificate({
      name,
      title,
      hashtags,
      dateSelected,
      message,
      imageUrl: uploadResponse.secure_url,
    });

    await certificate.save();

    if (userId) {
      const user = await User.findById(userId);
      if (user) {
        user.certificates.push(certificate._id);
        await user.save();
      }
    }

    res.status(201).json(certificate._id);
  } catch (error) {
    console.error("Error generating the certificate:", error);
    res.status(500).json({ error: "Error generating the certificate" });
  }
});

router.get("/certificate/:id", async (req, res) => {
  const certificateId = req.params.id;

  try {
    const certificateData = await Certificate.findById(certificateId);

    if (!certificateData) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found",
      });
    }

    const secureImageUrl = cloudinary.url(certificateData.imageUrl, {
      secure: true,
      sign_url: true,
    });

    const imageResponse = await axios.get(secureImageUrl, {
      responseType: "arraybuffer",
    });

    const imageData = Buffer.from(imageResponse.data, "binary").toString(
      "base64"
    );

    certificateData.imageUrl = null;
    res.json({
      success: true,
      ...certificateData.toObject(),
      imageData: `data:${imageResponse.headers["content-type"]};base64,${imageData}`,
    });
  } catch (error) {
    console.error("Error fetching certificate:", error);

    res.status(500).json({
      success: false,
      message: "An error occurred while fetching the certificate",
    });
  }
});

router.post("/user/:id/certificates", authMiddleware, async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).populate({
      path: "certificates",
      options: { limit: 20 },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.certificates.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No certificates found",
        certificates: [],
      });
    }

    const certificates = await Promise.all(
      user.certificates.map(async (certificate) => {
        const secureImageUrl = cloudinary.url(certificate.imageUrl, {
          secure: true,
          sign_url: true,
        });

        const imageResponse = await axios.get(secureImageUrl, {
          responseType: "arraybuffer",
        });

        const imageData = Buffer.from(imageResponse.data, "binary").toString(
          "base64"
        );

        return {
          ...certificate.toObject(),
          imageUrl: null,
          imageData: `data:${imageResponse.headers["content-type"]};base64,${imageData}`,
        };
      })
    );

    res.json({
      success: true,
      certificates,
    });
  } catch (error) {
    console.error("Error fetching certificates:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching certificates",
    });
  }
});

router.delete("/certificate/:id", authMiddleware, async (req, res) => {
  const certificateId = req.params.id;
  try {
    const certificate = await Certificate.findById(certificateId);

    if (!certificate) {
      return res
        .status(404)
        .json({ success: false, message: "Certificate not found" });
    }

    const publicId = certificate.imageUrl.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy(`certificates/${publicId}`);

    await Certificate.findByIdAndDelete(certificateId);

    await User.updateMany(
      { certificates: certificateId },
      { $pull: { certificates: certificateId } }
    );

    res
      .status(200)
      .json({ success: true, message: "Certificate deleted successfully" });
  } catch (error) {
    console.error("Error deleting certificate:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while deleting the certificate",
    });
  }
});

router.put("/certificate/:id", limiter, authMiddleware, async (req, res) => {
  const certificateId = req.params.id;
  const { data, formData } = req.body;
  const { name, title, hashtags, dateSelected, message } = formData || {};

  try {
    const certificate = await Certificate.findById(certificateId);
    if (!certificate) {
      return res
        .status(404)
        .json({ success: false, message: "Certificate not found" });
    }

    let imageUrl = certificate.imageUrl;
    if (data) {
      const uploadResponse = await cloudinary.uploader.upload(data, {
        folder: "certificates",
      });
      imageUrl = uploadResponse.secure_url;
    }

    certificate.name = name || certificate.name;
    certificate.title = title || certificate.title;
    certificate.hashtags = hashtags || certificate.hashtags;
    certificate.dateSelected = dateSelected || certificate.dateSelected;
    certificate.message = message || certificate.message;
    certificate.imageUrl = imageUrl;

    await certificate.save();

    res.status(200).json({
      success: true,
      message: "Certificate updated successfully",
      certificate,
    });
  } catch (error) {
    console.error("Error updating the certificate:", error);
    res
      .status(500)
      .json({ success: false, message: "Error updating the certificate" });
  }
});

module.exports = router;
