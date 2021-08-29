// const dealerRouter = require('express').Router();

// const DealerService = require('../services/DealerService');
// const DealerServiceInstance = new DealerService();


// module.exports = (app) => {
//     app.use('/dealers/products', dealersRouter);

//     dealersRouter.get('/', async (req, res, next) => {
//         console.log("first router get")
//         try {
//             const response = await DealerServiceInstance.allDealers();

//             res.status(200).send(response);
//         } catch(err) {
//             res.status(404).send(err)
//         }
    
//     })

//     dealersRouter.get('/:dealerId', async (req, res, next) => {
//         try {
//            const { dealerId } = req.params;
//            console.log(typeof parseInt(dealerId))
//            const aDealer = await DealerServiceInstance.oneDealer(Number(dealerId), 'dealers', 'did');
//            res.status(200).send(aDealer);
//         } catch(err) {
//             res.status(404).send(err)
//         }
//     })

// }

// // INSERT INTO films (name, release_year)
// // VALUES ('Monsters, Inc.', 2001);