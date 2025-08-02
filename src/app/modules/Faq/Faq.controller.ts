import catchAsync from '../../utils/catchAsync';
import pickValidFields from '../../utils/pickValidFields';
import sendResponse from '../../utils/sendResponse';
import { FaqValidFields } from './faq.constant';
import { createFaqService, updateFaqService, deleteFaqService, getFaqsService, getUserFaqsService } from './Faq.service';

const createFaq = catchAsync(async (req, res) => {
  const result = await createFaqService(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Faq is created successfully',
    data: result,
  });
});


const getFaqs = catchAsync(async (req, res) => {
  const validatedQuery = pickValidFields(req.query, FaqValidFields);
  const result = await getFaqsService(validatedQuery);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Faqs are retrieved successfully',
    meta: result.meta,
    data: result.data
  });
});

const getUserFaqs = catchAsync(async (req, res) => {
  const result = await getUserFaqsService();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Faqs are retrieved successfully',
    data:  result
  });
});

const updateFaq = catchAsync(async (req, res) => {
  const { faqId } = req.params;
  const result = await updateFaqService(faqId, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Faq is updated successfully',
    data: result,
  });
});

const deleteFaq = catchAsync(async (req, res) => {
  const { faqId } = req.params;
  const result = await deleteFaqService(faqId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Faq is deleted successfully',
    data: result,
  });
});

const FaqController = {
  createFaq,
  getFaqs,
  getUserFaqs,
  updateFaq,
  deleteFaq,
};
export default FaqController;
