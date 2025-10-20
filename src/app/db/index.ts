import config from "../config";
import UserModel from "../modules/User/user.model";

const superUser = {
    fullName: "Super Super",
    email: config.super_admin_email,
    password: config.super_admin_password, 
    role: 'super_admin',
    isVerified:true
}


const seedSuperAdmin = async () => {
    //when databse is connected, we will check is there any user who is super admin
    const isSuperAdminExists = await UserModel.findOne({ role: 'super_admin'});

    //check if there is no superAdmin
    if(!isSuperAdminExists){
        await UserModel.create(superUser);
        console.log("Super Admin Created");
    }
}


export default seedSuperAdmin;