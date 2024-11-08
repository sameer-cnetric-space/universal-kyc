const express = require("express");
const AdminController = require("../controllers/admin");
const {
  adminRegistrationSchema,
  adminLoginSchema,
} = require("../validations/admin");
const validate = require("../middlewares/validate");
const { adminAuth } = require("../middlewares/auth/admin");

const router = express.Router();

// Admin dashboard metrics endpoint
router.get("/metrics", adminAuth, AdminController.getMetrics);

// Admin registration route with Joi validation
router.post(
  "/register",
  validate(adminRegistrationSchema),
  AdminController.register
);

// Admin login route with Joi validation
router.post("/login", validate(adminLoginSchema), AdminController.login);

// Get admin by ID
router.get("/:id", adminAuth, AdminController.getAdminById);

module.exports = router;
