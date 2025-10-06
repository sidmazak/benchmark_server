import express from 'express';

const app = express();

app.get('/', (req, res) => {
    let sum = 0;
    for (let i = 0; i < 100000; i++) {
        sum += i;
    }
    res.send({
        sum: sum
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});