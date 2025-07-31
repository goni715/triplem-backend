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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSingleAdminService = exports.deleteAdminService = exports.getAdminsService = exports.updateAdminService = exports.createAdminService = void 0;
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const user_model_1 = __importDefault(require("../User/user.model"));
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("../../config"));
const QueryBuilder_1 = require("../../helper/QueryBuilder");
const admin_constant_1 = require("./admin.constant");
const createAdminService = (req, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = payload;
    const user = yield user_model_1.default.findOne({ email });
    if (user) {
        throw new ApiError_1.default(409, 'This Email is already existed');
    }
    if (!password) {
        payload.password = config_1.default.administrator_default_password;
    }
    //create admin
    const result = yield user_model_1.default.create(Object.assign(Object.assign({}, payload), { role: "admin", isVerified: true }));
    result.password = "";
    return result;
});
exports.createAdminService = createAdminService;
const getAdminsService = (query) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // 1. Extract query parameters
    const { searchTerm, page = 1, limit = 10, sortOrder = "desc", sortBy = "createdAt" } = query, filters = __rest(query, ["searchTerm", "page", "limit", "sortOrder", "sortBy"]) // Any additional filters
    ;
    // 2. Set up pagination
    const skip = (Number(page) - 1) * Number(limit);
    //3. setup sorting
    const sortDirection = sortOrder === "asc" ? 1 : -1;
    //4. setup searching
    let searchQuery = {};
    if (searchTerm) {
        searchQuery = (0, QueryBuilder_1.makeSearchQuery)(searchTerm, admin_constant_1.AdministratorSearchFields);
    }
    //5 setup filters
    let filterQuery = {};
    if (filters) {
        filterQuery = (0, QueryBuilder_1.makeFilterQuery)(filters);
    }
    const result = yield user_model_1.default.aggregate([
        {
            $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "user"
            }
        },
        {
            $unwind: "$user"
        },
        {
            $project: {
                _id: 1,
                userId: 1,
                access: 1,
                name: "$user.fullName",
                email: "$user.email",
                phone: "$user.phone",
                profileImg: "$user.profileImg",
                status: "$user.status",
                createdAt: "$createdAt",
                updatedAt: "$updatedAt",
            }
        },
        {
            $match: Object.assign(Object.assign({}, searchQuery), filterQuery)
        },
        { $sort: { [sortBy]: sortDirection } },
        { $skip: skip },
        { $limit: Number(limit) }
    ]);
    //total count
    const administratorResultCount = yield user_model_1.default.aggregate([
        {
            $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "user"
            }
        },
        {
            $unwind: "$user"
        },
        {
            $project: {
                _id: 1,
                userId: 1,
                access: 1,
                name: "$user.fullName",
                email: "$user.email",
                phone: "$user.phone",
                profileImg: "$user.profileImg",
                createdAt: "$createdAt",
                updatedAt: "$updatedAt",
            }
        },
        {
            $match: Object.assign(Object.assign({}, searchQuery), filterQuery)
        },
        { $count: "totalCount" }
    ]);
    const totalCount = ((_a = administratorResultCount[0]) === null || _a === void 0 ? void 0 : _a.totalCount) || 0;
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
});
exports.getAdminsService = getAdminsService;
const deleteAdminService = (administratorId) => __awaiter(void 0, void 0, void 0, function* () {
    const administrator = yield user_model_1.default.findById(administratorId);
    if (!administrator) {
        throw new ApiError_1.default(404, "Administrator Not found");
    }
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        //delete the administrator
        const result = yield user_model_1.default.deleteOne({
            _id: administratorId
        }, { session });
        // //delete the user
        // await UserModel.deleteOne(
        //   { _id: administrator.userId},
        //   { session }
        //)
        //transaction success
        yield session.commitTransaction();
        yield session.endSession();
        return result;
    }
    catch (err) {
        yield session.abortTransaction();
        yield session.endSession();
        throw new Error(err);
    }
});
exports.deleteAdminService = deleteAdminService;
const getSingleAdminService = (administratorId) => __awaiter(void 0, void 0, void 0, function* () {
    const administrator = yield user_model_1.default.findById(administratorId);
    if (!administrator) {
        throw new ApiError_1.default(404, "Administrator Not found");
    }
    return administrator;
});
exports.getSingleAdminService = getSingleAdminService;
const updateAdminService = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const administrator = yield user_model_1.default.findOne({ userId });
    if (!administrator) {
        throw new ApiError_1.default(404, "Administrator Not Found");
    }
    const result = user_model_1.default.updateOne({ _id: userId }, payload);
    return result;
});
exports.updateAdminService = updateAdminService;
