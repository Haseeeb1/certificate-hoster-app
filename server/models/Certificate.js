const mongoose = require("mongoose");

const CertificateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  hashtags: {
    type: String,
  },
  dateSelected: {
    type: String,
  },
  message: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
});
const Certificate = mongoose.model("Certificate", CertificateSchema);
module.exports = Certificate;
