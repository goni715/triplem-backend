import { NextFunction, Request, Response } from "express";
import { createProductValidationSchema } from "../../modules/Product/Product.validation";
import { ZodError } from "zod";


const CreateProductService = async (req: Request, res: Response) => {
    try {

        console.log(req.body)



        res.status(201).json({
            success: true,
            message: "Success",
            //parsedData
        })
    }
    catch (error) {
        if (error instanceof ZodError) {
            const formattedErrors: Record<string, string> = {};
            error.issues.forEach((e) => {
                if (e.path.length > 0) {
                    formattedErrors[e.path.join(".")] = e.message;
                }
            });

            //first error message
            const firstErrorMessage = error.issues[0]?.message || "Invalid input";

            return res.status(400).json({
                success: false,
                message: firstErrorMessage,
                error: formattedErrors,
            });
        }

        console.log("Error")

        return res.status(500).json({
                success: false,
                // message: firstErrorMessage,
                // error: formattedErrors,
            });
    }
    //return "Create Product Service";
}

export default CreateProductService;