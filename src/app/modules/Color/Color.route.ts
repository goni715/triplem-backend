import express from 'express';
import ColorController from './Color.controller';
import validationMiddleware from '../../middlewares/validationMiddleware';
import { createColorValidationSchema, updateColorValidationSchema } from './Color.validation';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import { UserRole } from '../User/user.constant';

const router = express.Router();

router.post(
  '/create-color',
  AuthMiddleware(UserRole.admin, UserRole.super_admin),
  validationMiddleware(createColorValidationSchema),
  ColorController.createColor,
);


router.get(
  "/get-color-drop-down",
  AuthMiddleware(UserRole.admin, UserRole.super_admin),
  ColorController.getColorDropDown
);

router.patch(
  '/update-color/:colorId',
  validationMiddleware(updateColorValidationSchema),
  ColorController.updateColor,
);

router.delete(
  '/delete-color/:colorId',
  ColorController.deleteColor,
);

router.get(
  '/get-colors',
  ColorController.getAllColors,
);

const ColorRoutes = router;
export default ColorRoutes;
