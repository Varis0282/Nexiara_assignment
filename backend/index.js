const express = require('express');
const app = express();
const port = 5000;
const cors = require('cors');
const authRoute = require('./Authentication/userRoute');
const questionRoute = require('./Question/questionRoute');
const paymentRoute = require('./Payments/paymentRoute');
require('./dbConfig');

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoute);
app.use('/api/question', questionRoute);
app.use('/api/payment', paymentRoute);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});