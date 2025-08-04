import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { subscribeToNewsletterService } from './Newsletter.service';

const subscribeToNewsletter = catchAsync(async (req, res) => {
  const result = await subscribeToNewsletterService(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Subscribed success',
    data: result,
  });
});


// const getAllContacts = catchAsync(async (req, res) => {
//   const result = await getAllContactsService(req.query);

//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: 'Contacts are retrieved successfully',
//     meta: result.meta,
//     data: result.data,
//   });
// });

// const replyContact = catchAsync(async (req, res) => {
//   const { contactId } = req.params;
//   const { replyText } = req.body;
//   const result = await replyContactService(contactId, replyText);

//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: 'Reply sent successfully.',
//     data: result,
//   });
// });

// const deleteContact = catchAsync(async (req, res) => {
//   const { contactId } = req.params;
//   const result = await deleteContactService(contactId);

//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: 'Contact is deleted successfully',
//     data: result,
//   });
// });

const NewsletterController = {
  subscribeToNewsletter
};
export default NewsletterController;
