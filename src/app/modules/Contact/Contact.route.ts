import express from 'express';
import ContactController from './Contact.controller';
import validationMiddleware from '../../middlewares/validationMiddleware';
import { createContactValidationSchema, updateContactValidationSchema } from './Contact.validation';
import { UserRole } from '../User/user.constant';
import AuthMiddleware from '../../middlewares/AuthMiddleware';

const router = express.Router();

router.post(
  '/create-contact',
  validationMiddleware(createContactValidationSchema),
  ContactController.createContact,
);

router.get(
  '/get-single-contact/:contactId',
  ContactController.getSingleContact,
);

router.patch(
  '/update-contact/:contactId',
  validationMiddleware(updateContactValidationSchema),
  ContactController.updateContact,
);

router.delete(
  '/delete-contact/:contactId',
  ContactController.deleteContact,
);

router.get(
  '/get-contacts',
  AuthMiddleware(UserRole.admin, UserRole.super_admin),
  ContactController.getAllContacts,
);

const ContactRoutes = router;
export default ContactRoutes;
