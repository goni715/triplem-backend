import express from 'express';
import ContactController from './Contact.controller';
import validationMiddleware from '../../middlewares/validationMiddleware';
import { createContactValidationSchema, updateContactValidationSchema } from './Contact.validation';

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
  '/get-all-contacts',
  ContactController.getAllContacts,
);

const ContactRoutes = router;
export default ContactRoutes;
