import express from 'express';
import { UserRoutes } from '../modules/User/user.route';
import { AuthRoutes } from '../modules/Auth/auth.route';
import ShippingRoutes from '../modules/Shipping/Shipping.route';
import { SizeRoutes } from '../modules/Size/Size.route';
import CategoryRoutes from '../modules/Category/Category.route';
import ProductRoutes from '../modules/Product/Product.route';


const router = express.Router();


const moduleRoutes = [
    {
        path: '/auth',
        route: AuthRoutes
    },
    {
        path: '/user',
        route: UserRoutes
    },
    {
        path: '/shipping',
        route: ShippingRoutes
    },
    {
        path: '/size',
        route: SizeRoutes
    },
    {
        path: '/category',
        route: CategoryRoutes
    },
    {
        path: '/product',
        route: ProductRoutes
    }
]

moduleRoutes.forEach((item, i)=> router.use(item.path, item.route));

export default router;