import express from 'express';
import {
  stripeWebhook,
} from './eventController.js';

const router = express.Router();

router.use(
  express.raw({ type: 'application/json' }),
  (req, res, next) => {
    const url = req.originalUrl;
    if (url.startsWith('/api/webhook')) {
      req.rawBody = req.body;
    }
    next();
  }
);

router.route('/').post(stripeWebhook);


export default router;