import express, { NextFunction, Request, Response } from 'express';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import { UserRole } from '../User/user.constant';
import validationMiddleware from '../../middlewares/validationMiddleware';
import AdministratorController from './admin.controller';
import { createAdminValidationSchema, updateAdministratorAccessSchema, updateAdministratorSchema } from './admin.validation';

const router = express.Router();

router.post(
  "/create-admin",
  AuthMiddleware(UserRole.super_admin),
  validationMiddleware(createAdminValidationSchema),
  AdministratorController.createAdmin
);

router.patch(
  "/update-administrator-access/:administratorId",
  AuthMiddleware(UserRole.super_admin),
  validationMiddleware(updateAdministratorAccessSchema),
  AdministratorController.updateAccess
);

router.patch(
  "/update-administrator/:userId",
  AuthMiddleware(UserRole.super_admin),
  validationMiddleware(updateAdministratorSchema),
  AdministratorController.updateAdmin
);

const AdminRoutes = router;
export default AdminRoutes;