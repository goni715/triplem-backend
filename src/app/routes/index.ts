import express from 'express';
import { UserRoutes } from '../modules/User/user.route';
import { AuthRoutes } from '../modules/Auth/auth.route';
import ShippingRoutes from '../modules/Shipping/Shipping.route';
import { SizeRoutes } from '../modules/Size/Size.route';
import CategoryRoutes from '../modules/Category/Category.route';
import ProductRoutes from '../modules/Product/Product.route';
import FavouriteRoutes from '../modules/Favourite/favourite.route';
import ColorRoutes from '../modules/Color/Color.route';
import OrderRoutes from '../modules/Order/Order.route';
import CartRoutes from '../modules/Cart/Cart.route';
import ContactRoutes from '../modules/Contact/Contact.route';


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
        path: '/color',
        route: ColorRoutes
    },
    {
        path: '/product',
        route: ProductRoutes
    },
    {
        path: '/favourite',
        route: FavouriteRoutes
    },
    {
        path: '/cart',
        route: CartRoutes
    },
    {
        path: '/order',
        route: OrderRoutes
    },
    {
        path: '/contact',
        route: ContactRoutes
    }
]

moduleRoutes.forEach((item, i)=> router.use(item.path, item.route));

export default router;