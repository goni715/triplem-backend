import ApiError from '../../errors/ApiError';
import { makeFilterQuery, makeSearchQuery } from '../../helper/QueryBuilder';
import { FaqSearchFields } from './faq.constant';
import { IFaq, TFaqQuery } from './Faq.interface';
import FaqModel from './Faq.model';
import slugify from 'slugify';

const createFaqService = async (
  payload: IFaq,
) => {
  const { question } = payload;
  const slug = slugify(question).toLowerCase();
  payload.slug=slug;

  //check faq is already exist
  const faq = await FaqModel.findOne({ slug });
  if(faq){
    throw new ApiError(409, "This question is already existed");
  }

  const result = await FaqModel.create(payload);
  
  return result;
};


const getFaqsService = async (query: TFaqQuery) => {
  // 1. Extract query parameters
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
    searchQuery = makeSearchQuery(searchTerm, FaqSearchFields);
  }

  //5 setup filters
  let filterQuery = {};
  if (filters) {
    filterQuery = makeFilterQuery(filters);
  }

  const result = await FaqModel.aggregate([
    {
      $match: {
        ...searchQuery,
        ...filterQuery
      }
    },
    { $sort: { [sortBy]: sortDirection } },
    {
      $project: {
        category: 0,
        slug: 0,
        createdAt: 0,
        updatedAt: 0
      }
    },
    { $skip: skip },
    { $limit: Number(limit) },
  ]);




  // total count
  const totalCountResult = await FaqModel.aggregate([
    {
      $match: {
        ...searchQuery,
        ...filterQuery
      }
    },
    { $count: "totalCount" }
  ])

  const totalCount = totalCountResult[0]?.totalCount || 0;
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
}


const getUserFaqsService = async () => {
  const result = await FaqModel.aggregate([
    {
      $match: {
        isActive: true
      }
    },
    {
      $project: {
        category:0,
        slug:0,
        createdAt: 0,
        isActive:0,
        updatedAt:0
      }
    },
    {
      $sort: { createdAt: -1 }
    }
  ]);
  return result;
}



const updateFaqService = async (faqId: string, payload: Partial<IFaq>) => {
  const faq = await FaqModel.findById(faqId);
  if(!faq){
    throw new ApiError(404, "Faq Not Found");
  }

  if(payload?.question){
    const slug = slugify(payload.question).toLowerCase();
    payload.slug = slug;
    const faqExist = await FaqModel.findOne({
      _id: { $ne: faqId },
      slug
    });
    if (faqExist) {
      throw new ApiError(409, "Sorry! This Question is already existed");
    }
  }

  const result = await FaqModel.updateOne(
    { _id: faqId },
    payload,
  );

  return result;
};

const deleteFaqService = async (faqId: string) => {
  const faq = await FaqModel.findById(faqId);
  if(!faq){
    throw new ApiError(404, "Faq Not Found");
  }

  const result = await FaqModel.deleteOne({ _id: faqId });
  return result;
};

export {
  createFaqService,
  getFaqsService,
  getUserFaqsService,
  updateFaqService,
  deleteFaqService,
};
