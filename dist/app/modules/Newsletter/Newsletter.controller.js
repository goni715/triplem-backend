"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const Newsletter_service_1 = require("./Newsletter.service");
const subscribeToNewsletter = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, Newsletter_service_1.subscribeToNewsletterService)(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: 'Subscribed success',
        data: result,
    });
}));
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
exports.default = NewsletterController;
