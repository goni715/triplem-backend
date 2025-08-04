import express from 'express';
import validationMiddleware from '../../middlewares/validationMiddleware';
import { newsletterValidationSchema, replyContactValidationSchema } from './Newsletter.validation';
import NewsletterController from './Newsletter.controller';

const router = express.Router();

router.post(
  '/subscribe',
  validationMiddleware(newsletterValidationSchema),
  NewsletterController.subscribeToNewsletter,
);


const NewsletterRoutes = router;
export default NewsletterRoutes;
