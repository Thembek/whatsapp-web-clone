import APP from 'express';
import connectDB from './dbconnection';
import routes from './routes';

const app = new APP();
require('./config')(app);

const PORT = 8000;

const startServer = () => {
    Promise.all([connectDB()])
        .then(() => {
            app.listen(PORT);
            console.log(`Server started on Port: http://localhost:${PORT}`);
            routes(app);
        })
        .catch((error) => console.log(`Unable to start the server`, error));
};

startServer();