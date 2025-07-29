
import ApiError from '../../errors/ApiError';
import { ContactSearchableFields } from './Contact.constant';
import { IContact, TContactQuery } from './Contact.interface';
import ContactModel from './Contact.model';
import { makeFilterQuery, makeSearchQuery } from '../../helper/QueryBuilder';

const createContactService = async (
  payload: IContact,
) => {
  const result = await ContactModel.create(payload);
  return result;
};

const getAllContactsService = async (query: TContactQuery) => {
  const {
    searchTerm, 
    page = 1, 
    limit = 10, 
    sortOrder = "desc",
    sortBy = "createdAt", 
    ...filters  // Any additional filters
  } = query;

  // 2. Set up pagination
  const skip = (Number(page) - 1) * Number(limit);

  //3. setup sorting
  const sortDirection = sortOrder === "asc" ? 1 : -1;

  //4. setup searching
  let searchQuery = {};
  if (searchTerm) {
    searchQuery = makeSearchQuery(searchTerm, ContactSearchableFields);
  }

  //5 setup filters
  let filterQuery = {};
  if (filters) {
    filterQuery = makeFilterQuery(filters);
  }
  const result = await ContactModel.aggregate([
    {
      $match: {
        ...searchQuery, // Apply search query
        ...filterQuery, // Apply filters
      },
    },
    {
      $project: {
        _id: 1,
        fullName: 1,
        email: 1,
        phone: 1,
        gender:1,
        role: 1,
        status: 1,
        profileImg: 1,
        createdAt: 1,
        updatedAt: 1,
      },
    },
    { $sort: { [sortBy]: sortDirection } }, 
    { $skip: skip }, 
    { $limit: Number(limit) }, 
  ]);

     // total count
  const totalReviewResult = await ContactModel.aggregate([
    {
      $match: {
        ...searchQuery,
        ...filterQuery
      }
    },
    { $count: "totalCount" }
  ])

  const totalCount = totalReviewResult[0]?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / Number(limit));

return {
  meta: {
    page: Number(page), //currentPage
    limit: Number(limit),
    totalPages,
    total: totalCount,
  },
  data: result,
};
};

const getSingleContactService = async (contactId: string) => {
  const result = await ContactModel.findById(contactId);
  if (!result) {
    throw new ApiError(404, 'Contact Not Found');
  }

  return result;
};

const updateContactService = async (contactId: string, payload: any) => {
 
  const contact = await ContactModel.findById(contactId);
  if(!contact){
    throw new ApiError(404, "Contact Not Found");
  }
  const result = await ContactModel.updateOne(
    { _id: contactId },
    payload,
  );

  return result;
};

const deleteContactService = async (contactId: string) => {
  const contact = await ContactModel.findById(contactId);
  if(!contact){
    throw new ApiError(404, "Contact Not Found");
  }
  const result = await ContactModel.deleteOne({ _id:contactId });
  return result;
};

export {
  createContactService,
  getAllContactsService,
  getSingleContactService,
  updateContactService,
  deleteContactService,
};
