
import { INewsletter } from './Newsletter.interface';
import NewsletterModel from './Newsletter.model';

const subscribeToNewsletterService = async (
  payload: INewsletter,
) => {
  const newsletter = await NewsletterModel.findOne({ email: payload.email });
  if(newsletter){
    const result = await NewsletterModel.updateOne(
      { email: payload.email },
      { subscribedAt: new Date()}
    );
    return result;
  }

  const result = await NewsletterModel.create(payload);
  return result;
};

// const getAllContactsService = async (query: TContactQuery) => {
//   const {
//     searchTerm, 
//     page = 1, 
//     limit = 10, 
//     sortOrder = "desc",
//     sortBy = "createdAt", 
//     ...filters  // Any additional filters
//   } = query;

//   // 2. Set up pagination
//   const skip = (Number(page) - 1) * Number(limit);

//   //3. setup sorting
//   const sortDirection = sortOrder === "asc" ? 1 : -1;

//   //4. setup searching
//   let searchQuery = {};
//   // if (searchTerm) {
//   //   searchQuery = makeSearchQuery(searchTerm, ContactSearchableFields);
//   // }

//   //5 setup filters
//   let filterQuery = {};
//   if (filters) {
//     filterQuery = makeFilterQuery(filters);
//   }
//   const result = await ContactModel.aggregate([
//     {
//       $match: {
//         ...searchQuery, 
//         ...filterQuery
//       },
//     },
//     {
//       $project: {
//         updatedAt: 0
//       },
//     },
//     { $sort: { [sortBy]: sortDirection } }, 
//     { $skip: skip }, 
//     { $limit: Number(limit) }, 
//   ]);

//      // total count
//   const totalCountResult = await ContactModel.aggregate([
//     {
//       $match: {
//         ...searchQuery,
//         ...filterQuery
//       }
//     },
//     { $count: "totalCount" }
//   ])

//   const totalCount = totalCountResult[0]?.totalCount || 0;
//   const totalPages = Math.ceil(totalCount / Number(limit));

// return {
//   meta: {
//     page: Number(page), //currentPage
//     limit: Number(limit),
//     totalPages,
//     total: totalCount,
//   },
//   data: result,
// };
// };


// const deleteContactService = async (contactId: string) => {
//   if (!Types.ObjectId.isValid(contactId)) {
//     throw new ApiError(400, "contactId must be a valid ObjectId")
//   }
//   const contact = await ContactModel.findById(contactId);
//   if(!contact){
//     throw new ApiError(404, "contactId Not Found");
//   }
//   const result = await ContactModel.deleteOne({ _id:contactId });
//   return result;
// };

export {
  subscribeToNewsletterService
};
