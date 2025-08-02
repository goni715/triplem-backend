import express, { NextFunction, Request, Response } from 'express';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import { UserRole } from '../User/user.constant';
import validationMiddleware from '../../middlewares/validationMiddleware';
import { createAdminValidationSchema, updateAdminSchema } from './admin.validation';
import AdminController from './admin.controller';

const router = express.Router();

router.post(
  "/create-admin",
  AuthMiddleware(UserRole.super_admin, "admin"),
  validationMiddleware(createAdminValidationSchema),
  AdminController.createAdmin
);

router.get("/get-admins",
  AuthMiddleware(UserRole.super_admin),
  AdminController.getAdmins
)


router.patch(
  "/update-admin/:adminId",
  AuthMiddleware(UserRole.super_admin),
  validationMiddleware(updateAdminSchema),
  AdminController.updateAdmin
);

const AdminRoutes = router;
export default AdminRoutes;