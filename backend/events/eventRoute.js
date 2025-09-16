import express from 'express';
import {
  createEvent,
  deleteEvent,
  updateEvent,
  getAllEvents,
  getEventById,
  subscribe,
  createCheckoutSession,
  getEventPrice,
  upload,
} from './eventController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Define routes for events
router
  .route('/')
  .post(protect, upload.single('banner'), createEvent) // Only authenticated users can create events
  .get(protect, admin, getAllEvents); // Only admin users can get all events

router
  .route('/:id')
  .delete(protect, admin, deleteEvent) // Only admin users can delete events
  .put(protect, upload.single('banner'), admin, updateEvent); // Only admin users can update events

router.get('/:id', getEventById);

router
  .route('/:id/subscribe')
  .post(subscribe);

router
  .route('/:id/price')
  .get(getEventPrice);

router
  .route('/create-checkout-session')
  .post(createCheckoutSession);


export default router;