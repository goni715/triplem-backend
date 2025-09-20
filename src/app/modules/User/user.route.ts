import express from 'express';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import { UserRole } from './user.constant';
import UserController from './user.controller';
import validationMiddleware from '../../middlewares/validationMiddleware';
import { updateProfileValidationSchema } from './user.validation';
import upload from '../../helper/upload';

const router = express.Router();


router.get(
  "/get-users",
  AuthMiddleware(UserRole.super_admin, UserRole.admin),
  UserController.getUsers
);
router.get(
  "/get-single-user/:id",
  AuthMiddleware(UserRole.super_admin, UserRole.admin),
  UserController.getSingleUser
);
router.get(
  "/get-me",
  AuthMiddleware(UserRole.super_admin, UserRole.user, UserRole.user, UserRole.admin),
  UserController.getMe
);

router.get(
  "/get-me-for-super-admin",
  AuthMiddleware(UserRole.super_admin),
  UserController.getMeForSuperAdmin
);


router.patch(
  "/edit-my-profile",
   AuthMiddleware(UserRole.super_admin, UserRole.user, UserRole.user, UserRole.admin),
  upload.single('file'),
  validationMiddleware(updateProfileValidationSchema),
  UserController.editMyProfile
);

router.get('/get-user-overview/:year', AuthMiddleware("super_admin", "admin"), UserController.getUserOverview);
router.get('/get-stats', AuthMiddleware("super_admin", "admin"), UserController.getStats);


export const UserRoutes = router;
