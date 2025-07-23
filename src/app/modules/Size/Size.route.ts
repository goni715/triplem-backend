import express from 'express';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import { UserRole } from '../User/user.constant';
import validationMiddleware from '../../middlewares/validationMiddleware';
import { sizeValidationSchema } from './Size.validation';
import SizeController from './Size.controller';

const router = express.Router();

router.post(
  "/create-size",
  AuthMiddleware(UserRole.admin, UserRole.super_admin),
  validationMiddleware(sizeValidationSchema),
  SizeController.createSize
);

router.get(
  "/get-size-drop-down",
  AuthMiddleware(UserRole.admin, UserRole.super_admin),
  SizeController.getSizeDropDown
);
router.patch(
  "/update-size/:sizeId",
  AuthMiddleware(UserRole.admin, UserRole.super_admin),
  validationMiddleware(sizeValidationSchema),
  SizeController.updateSize
);
router.delete(
  "/delete-size/:sizeId",
  AuthMiddleware(UserRole.admin, UserRole.super_admin),
  SizeController.deleteSize
);


export const SizeRoutes = router;