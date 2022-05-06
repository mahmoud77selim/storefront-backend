import express, {
  Application,
  Request,
  Response,
  RequestHandler,
} from 'express';
import { routes } from './routes';
export const app: Application = express();

const address = '0.0.0.0:3000';

app.use(express.json() as RequestHandler);
app.use(express.urlencoded({ extended: true }) as RequestHandler);

routes(app);

app.get('/', function (req: Request, res: Response) {
  res.send('Welcome to Shopping stack');
});
app.listen(3000, function () {
  console.log(`app server started @http://${address}`);
});

// import dotenv from 'dotenv'; import path from 'path'; import morgan from 'morgan';
// const Err404 = (req: Request, res: Response) => {
// res.status(404); res.render('pageNotFound');};

// dotenv.config();
// const port = process.env['SERVER_PORT'];

// app.use('/public', express.static(path.join(__dirname, 'public')));
// app.set('views', path.resolve(__dirname, 'views'));
// app.set('view engine', 'ejs');
