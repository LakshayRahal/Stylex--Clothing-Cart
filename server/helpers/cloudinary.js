const cloudinary = require("cloudinary").v2;
const multer = require("multer");

cloudinary.config({
cloud_name:"deexypcsu",
    api_key:"375144522933992",
    api_secret:"s6YurHwMMeqC6c2KiC3Ii4G80Ec",
});

const storage = new multer.memoryStorage();

async function imageUploadUtil(file) {
  const result = await cloudinary.uploader.upload(file, {
    resource_type: "auto",
  });

  return result;
}

const upload = multer({ storage });

module.exports = { upload, imageUploadUtil };
