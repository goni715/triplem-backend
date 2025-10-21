import express, { Application, Request, Response, NextFunction } from "express";
import cors from 'cors';
import router from "./app/routes";
import morgan from "morgan";
import notFound from "./app/middlewares/notFound";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import cookieParser from 'cookie-parser';
import path from "path";
import bodyParser from "body-parser";


const app: Application = express();


app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
      "http://localhost:3003",
      "http://10.10.20.24:5173",
      "http://10.10.20.24:3000",
      "https://triplemcompany.com",
      "https://dashboard.triplemcompany.com",
      "https://triplem-ecommerce-goni.vercel.app",
      "https://triplem-dashboard-goni.vercel.app",
    ],
    credentials: true,
  }),
);


app.use(cookieParser())

//prvent http paramater polution
// app.use(hpp({
//     whitelist: ["skills"]  //Allow these duplicate parameters
// }))
app.use(morgan('dev'))

app.get('/', (req:Request, res:Response) => {
    res.send(`TRipleM ecommerce backend is running......`);
});


//custom middleware implementation
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())



//application routes
app.use('/api/v1', router);

//serve uploads folder
app.use("/uploads", express.static(path.join(__dirname, "../uploads",)))



// Global Error-handling middleware
app.use(globalErrorHandler);



//route not found
app.use(notFound)


export default app;