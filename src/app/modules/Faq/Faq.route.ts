import express from 'express';
import FaqController from './Faq.controller';
import validationMiddleware from '../../middlewares/validationMiddleware';
import { createFaqValidationSchema, updateFaqValidationSchema } from './Faq.validation';
import AuthMiddleware from '../../middlewares/AuthMiddleware';

const router = express.Router();

router.post(
  '/create-Faq',
  AuthMiddleware("super_admin", "admin"),
  validationMiddleware(createFaqValidationSchema),
  FaqController.createFaq,
);
router.get(
  '/get-user-faqs',
  FaqController.getUserFaqs
);
router.get(
  '/get-faqs',
  AuthMiddleware("super_admin", "admin"),
  FaqController.getFaqs
);

router.patch(
  '/update-faq/:faqId',
  AuthMiddleware("super_admin", "admin"),
  validationMiddleware(updateFaqValidationSchema),
  FaqController.updateFaq,
);

router.delete(
  '/delete-faq/:faqId',
  AuthMiddleware("super_admin", "admin"),
  FaqController.deleteFaq,
);



const FaqRoutes = router;
export default FaqRoutes;
