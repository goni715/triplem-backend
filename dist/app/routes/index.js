"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_route_1 = require("../modules/User/user.route");
const auth_route_1 = require("../modules/Auth/auth.route");
const Shipping_route_1 = __importDefault(require("../modules/Shipping/Shipping.route"));
const Size_route_1 = require("../modules/Size/Size.route");
const Category_route_1 = __importDefault(require("../modules/Category/Category.route"));
const Product_route_1 = __importDefault(require("../modules/Product/Product.route"));
const favourite_route_1 = __importDefault(require("../modules/Favourite/favourite.route"));
const Color_route_1 = __importDefault(require("../modules/Color/Color.route"));
const Order_route_1 = __importDefault(require("../modules/Order/Order.route"));
const Cart_route_1 = __importDefault(require("../modules/Cart/Cart.route"));
const Contact_route_1 = __importDefault(require("../modules/Contact/Contact.route"));
const review_route_1 = __importDefault(require("../modules/Review/review.route"));
const Information_route_1 = __importDefault(require("../modules/Information/Information.route"));
const admin_route_1 = __importDefault(require("../modules/Admin/admin.route"));
const Policy_route_1 = __importDefault(require("../modules/Policy/Policy.route"));
const Faq_route_1 = __importDefault(require("../modules/Faq/Faq.route"));
const Payment_route_1 = __importDefault(require("../modules/Payment/Payment.route"));
const Newsletter_route_1 = __importDefault(require("../modules/Newsletter/Newsletter.route"));
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: '/auth',
        route: auth_route_1.AuthRoutes
    },
    {
        path: '/user',
        route: user_route_1.UserRoutes
    },
    {
        path: '/admin',
        route: admin_route_1.default
    },
    {
        path: '/shipping',
        route: Shipping_route_1.default
    },
    {
        path: '/size',
        route: Size_route_1.SizeRoutes
    },
    {
        path: '/category',
        route: Category_route_1.default
    },
    {
        path: '/color',
        route: Color_route_1.default
    },
    {
        path: '/product',
        route: Product_route_1.default
    },
    {
        path: '/favourite',
        route: favourite_route_1.default
    },
    {
        path: '/cart',
        route: Cart_route_1.default
    },
    {
        path: '/order',
        route: Order_route_1.default
    },
    {
        path: '/review',
        route: review_route_1.default
    },
    {
        path: '/contact',
        route: Contact_route_1.default
    },
    {
        path: '/information',
        route: Information_route_1.default
    },
    {
        path: '/policy',
        route: Policy_route_1.default
    },
    {
        path: '/faq',
        route: Faq_route_1.default
    },
    {
        path: '/admin',
        route: admin_route_1.default
    },
    {
        path: '/payment',
        route: Payment_route_1.default
    },
    {
        path: '/newsletter',
        route: Newsletter_route_1.default
    }
];
moduleRoutes.forEach((item, i) => router.use(item.path, item.route));
exports.default = router;
