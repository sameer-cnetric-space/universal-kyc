const express = require("express");
const KycController = require("../controllers/kyc");
const validate = require("../middlewares/validate");
const { kycSchema } = require("../validations/kyc");
const { upload } = require("../services/fileUpload");
const userAuth = require("../middlewares/auth/user");
const { adminAuth } = require("../middlewares/auth/admin");
const {
  checkImageQualityMiddleware,
} = require("../middlewares/imageQualityCheck");
const {
  checkExistingModeration,
} = require("../middlewares/moderationValidator");

const {
  checkKycExists,
  checkKycStatus,
} = require("../middlewares/kycValidator");
const router = express.Router();
const { userRateLimiter, adminRateLimiter } = require("../utils/rateLimiter");

//Get all KYC Entries (For Admins)
router.get("/", adminRateLimiter, adminAuth, KycController.getAllKycEntries);

//Get all KYC Entries (For Users)
router.get(
  "/history",
  userRateLimiter,
  userAuth,
  KycController.getUserKycEntries
);

// Get KYC details by ID (For Admins)
router.get(
  "/:id/admin",
  adminRateLimiter,
  adminAuth,
  KycController.getKycWithModeration
);

// Get KYC details by ID (User must be authenticated)
router.get("/:id", userRateLimiter, userAuth, KycController.getKycById);

// Create a new KYC entry (User must be authenticated)
router.post(
  "/",
  userRateLimiter,
  userAuth,
  validate(kycSchema),
  checkKycStatus,
  KycController.createKyc
);

// KYC submission (with Joi validation and Multer for file upload) (User must be authenticated)
router.post(
  "/:kycId/upload",
  userRateLimiter,
  userAuth,
  checkImageQualityMiddleware,
  checkKycExists,
  checkExistingModeration,
  upload.fields([
    { name: "selfie", maxCount: 1 },
    { name: "document", maxCount: 1 },
  ]),
  KycController.uploadKycAssets
);

// Update KYC status (For Admins)
router.put("/:id/status", adminAuth, KycController.updateKycStatus);

module.exports = router;
