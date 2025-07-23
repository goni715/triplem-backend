import express from 'express';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import { UserRole } from '../User/user.constant';
import validationMiddleware from '../../middlewares/validationMiddleware';
import SizeController from './size.controller';
import { sizeValidationSchema } from './Size.validation';

const router = express.Router();

router.post(
  "/create-size",
  AuthMiddleware(UserRole.admin, UserRole.super_admin),
  validationMiddleware(sizeValidationSchema),
  SizeController.createSize
);


// router.get(
//   "/get-dining-drop-down",
//   AuthMiddleware(UserRole.admin, UserRole.super_admin),
//   SizeController.getDiningDropDown
// );
// router.patch(
//   "/update-dining/:diningId",
//   AuthMiddleware(UserRole.admin, UserRole.super_admin),
//   validationMiddleware(diningValidationSchema),
//   SizeController.updateDining
// );
// router.delete(
//   "/delete-dining/:diningId",
//   AuthMiddleware(UserRole.admin, UserRole.super_admin),
//   SizeController.deleteDining
// );


export const SizeRoutes = router;