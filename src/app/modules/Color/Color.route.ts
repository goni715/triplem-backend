import express from 'express';
import ColorController from './Color.controller';
import validationMiddleware from '../../middlewares/validationMiddleware';
import { createColorValidationSchema, updateColorValidationSchema } from './Color.validation';

const router = express.Router();

router.post(
  '/create-color',
  validationMiddleware(createColorValidationSchema),
  ColorController.createColor,
);

router.get(
  '/get-single-color/:colorId',
  ColorController.getSingleColor,
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
  '/get-all-colors',
  ColorController.getAllColors,
);

const ColorRoutes = router;
export default ColorRoutes;
