import { NextFunction, Request, Response } from "express";

const parseJsonDataMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.body?.data) {
        console.log(JSON.parse(req.body.data))
      req.body = JSON.parse(req.body.data);
    }
    next();
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON in 'data' field",
    });
  }
};

export default parseJsonDataMiddleware;
