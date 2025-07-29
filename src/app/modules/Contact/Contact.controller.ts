import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { createContactService, getSingleContactService, getAllContactsService, updateContactService, deleteContactService } from './Contact.service';

const createContact = catchAsync(async (req, res) => {
  const result = await createContactService(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Contact is created successfully',
    data: result,
  });
});

const getSingleContact = catchAsync(async (req, res) => {
  const { contactId } = req.params;
  const result = await getSingleContactService(contactId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Contact is retrieved successfully',
    data: result,
  });
});

const getAllContacts = catchAsync(async (req, res) => {
  const result = await getAllContactsService(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Contacts are retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const updateContact = catchAsync(async (req, res) => {
  const { contactId } = req.params;
  const result = await updateContactService(contactId, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Contact is updated successfully',
    data: result,
  });
});

const deleteContact = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await deleteContactService(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Contact is deleted successfully',
    data: result,
  });
});

const ContactController = {
  createContact,
  getSingleContact,
  getAllContacts,
  updateContact,
  deleteContact,
};
export default ContactController;
