const { Storage } = require("@google-cloud/storage");
const path = require("path");

// Inisialisasi Google Cloud Storage
const storage = new Storage({
  projectId: process.env.PROJECT_ID,
  credentials: {
    type: "service_account",
    project_id: process.env.PROJECT_ID,
    private_key_id: process.env.PRIVATE_KEY_ID,
    private_key: process.env.PRIVATE_KEY.replace(/\\n/g, "\n"),
    client_email: process.env.CLIENT_EMAIL,
    client_id: process.env.CLIENT_ID,
    auth_uri: process.env.AUTH_URI,
    token_uri: process.env.TOKEN_URI,
    auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
  },
});

const bucketName = "komura-audio-bucket"; // Ganti dengan nama bucket kamu

const getAudioAllAudio = async () => {
  try {
    const [files] = await storage.bucket(bucketName).getFiles();
    const fileNames = files.map((file) => file.name);
    console.log("Files:", fileNames);
    return fileNames;
  } catch (err) {
    console.error("Error getting files:", err);
    throw err;
  }
};

const deleteAudio = async (fileName) => {
  try {
    console.log(`Attempting to delete file: ${fileName}`);

    // Validasi parameter
    if (!fileName) {
      throw new Error("File name is required for deletion.");
    }

    // Periksa apakah file ada sebelum menghapus
    const file = storage.bucket(bucketName).file(fileName);
    const [exists] = await file.exists();
    if (!exists) {
      throw new Error(
        `File ${fileName} does not exist in bucket ${bucketName}.`
      );
    }

    // Hapus file
    await file.delete();
    console.log(`File ${fileName} deleted successfully.`);
    return `File ${fileName} deleted successfully.`;
  } catch (err) {
    console.error("Error deleting file:", err.message || err);
    throw new Error(`Failed to delete file ${fileName}: ${err.message || err}`);
  }
};

// Fungsi untuk upload file photo profil
const uploadPictureProfile = async (file, fileName) => {
  const bucket = storage.bucket(bucketName);
  const uploadOptions = {
    destination: `profile-pictures/${fileName}`,
    metadata: {
      contentType: file.mimetype,
    },
  };

  // upload file, get url, return url
  return new Promise((resolve, reject) => {
    bucket.upload(file.path, uploadOptions, (err, uploadedFile) => {
      if (err) {
        console.error("Error uploading file:", err);
        return reject(err);
      }
      const url = uploadedFile[0].metadata.mediaLink;
      console.log("File uploaded to:", url);
      resolve(url);
    });
  });
};

module.exports = {
  getAudioAllAudio,
  uploadPictureProfile,
  deleteAudio,
};
