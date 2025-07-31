import express, { NextFunction, Request, Response } from 'express';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import { UserRole } from '../User/user.constant';
import validationMiddleware from '../../middlewares/validationMiddleware';
import AdministratorController from './admin.controller';
import { createAdminValidationSchema, updateAdministratorAccessSchema, updateAdministratorSchema } from './admin.validation';

const router = express.Router();

router.post(
  "/create-admin",
  AuthMiddleware(UserRole.super_admin, "admin"),
  validationMiddleware(createAdminValidationSchema),
  AdministratorController.createAdmin
);


router.patch(
  "/update-admin/:adminId",
  AuthMiddleware(UserRole.super_admin, "admin"),
  validationMiddleware(updateAdministratorSchema),
  AdministratorController.updateAdmin
);

const AdminRoutes = router;
export default AdminRoutes;