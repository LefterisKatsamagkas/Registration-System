import Event from '../events/eventModel.js';
import User from '../users/userModel.js';
import Stripe from 'stripe';
import nodemailer from 'nodemailer';
import multer from 'multer';
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import AWS from 'aws-sdk';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { Resend } from 'resend';
// import WelcomeEmail from "../../frontend/src/emails/welcome.js";

dotenv.config();

const ses = new AWS.SES({ region: 'eu-central-1' });

const bucketName = process.env.AWS_BUCKET_NAME
const bucketRegion = process.env.AWS_REGION
const accessKey = process.env.AWS_ACCESS_KEY_ID
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
const stripeKey = process.env.STRIPE_KEY

const randomImageName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex');

const stripe = new Stripe(stripeKey);

//@desc Create an event
//@route POST/api/events
//@access Private

const s3 = new S3Client({
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey,
  },
  region: bucketRegion,
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const createEvent = async (req, res) => {
  const { name, description, creator, startDate, endDate, event_amount, event_currency } = req.body;
  let url = null;

  if (!name || !description) {
    return res.status(400).json({message: 'You need to provide name and description'})
  }
  const randomName = randomImageName();
  try {
    const product = await stripe.products.create({
      name: name,
    });

    const price = await stripe.prices.create({
      unit_amount: event_amount * 100,
      currency: event_currency,
      product: product.id,
    });

    const event = await Event.create({
      name,
      description,
      creator,
      startDate,
      endDate,
      price: price.id,
      banner: url,
    });

    if (req.file) {
      const params = {
        Bucket: bucketName,
        Key: randomName,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
        ACL: 'public-read-write',
      };

      const command = new PutObjectCommand(params);
      await s3.send(command);
      url = `https://${bucketName}.s3.${bucketRegion}.amazonaws.com/${randomName}`;
      event.banner = url;
      await event.save();
    }

    console.log(event);

    res.status(201).json(event);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(400).json({ message: 'Failed to create event' });
  }
};

//@desc Delete an event
//@route DELETE/api/events/:id
//@access Private

const deleteEvent = async (req, res) => {
  const eventId = req.params.id;
  try {
    const event = await Event.findByIdAndDelete(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // const price_id = event.price;
    // const price = await stripe.prices.retrieve(price_id);
    // const product = price.product;
    // await stripe.products.del(product);

    if (event.banner) {  
      const bannerName = event.banner.slice(67,67+64);

      const deleteObjectParams = {
        Bucket: bucketName,
        Key: bannerName,
      }

      const command = new DeleteObjectCommand(deleteObjectParams);
      await s3.send(command);
    }

    res.status(200).json({ message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting event' });
    console.log(error);
  }
};

//@desc Update an event
//@route PUT/api/events/:id
//@access Private

const updateEvent = async (req, res) => {
  const eventId = req.params.id;
  const { name, description, event_amount, event_currency } = req.body;
  let url = null;
  const randomName = randomImageName();

  try {
    const event = await Event.findById(eventId);
    event.name = name || event.name;
    event.description = description || event.description;
    if ( event_amount && event_currency) {

      const price = await stripe.prices.retrieve(event.price);
      const product_id = price.product;

      const new_price = await stripe.prices.create({
        unit_amount: event_amount*100,
        currency: event_currency,
        product: product_id,
      });
      event.price = new_price.id;
    } else {
      event.price = event.price
    }

    if (req.file !== undefined) {
      const params = {
        Bucket: bucketName,
        Key: randomName,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
        ACL: 'public-read-write',
      };

      const command = new PutObjectCommand(params);
      await s3.send(command);

      if (event.banner) {
        const deleteObjectParams = {
          Bucket: bucketName,
          Key: event.banner.slice(67,67+64),
        };
        const deleteCommand = new DeleteObjectCommand(deleteObjectParams);
        await s3.send(deleteCommand);
      }

      url = `https://${bucketName}.s3.${bucketRegion}.amazonaws.com/${randomName}`;
      
      // Update event banner in the database
      event.banner = url;
    } else {
      event.banner = event.banner;
    }

    // Save the updated event to the database
    await event.save();

    console.log(event);

    res.status(200).json(event);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: 'Failed to update event' });
  }
};


//@desc Get all events
//@route GET/api/events
//@access Private

const getAllEvents = async (req, res) => {
  const { creatorId } = req.query;
  console.log(creatorId);
  try {
    const events = await Event.find({ creator: creatorId }).sort({ createdAt: -1 });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error getting events' });
  }
};

//@desc Get event by ID
//@route GET/api/events/:id
//@access Private

const getEventById = async (req, res) => {
  const eventId = req.params.id;

  try {
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Error getting event' });
  }
};

//@desc Subscribe to event by ID
//@route POST/api/events/:id/subscribe
//@access Private
const subscribe = async (req, res) => {
  try {
    const { eventId, name, email, phoneNumber, address, isSubscribed } = req.body;
    // Update Event
    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      {
        $push: {
          registrants: {
            name,
            email,
            phoneNumber,
            address,
            isSubscribed,
          },
        },
      },
      { new: true }
    );

    // Return both updated user and event
    res.json({ updatedEvent });
    
  } catch (error) {
    console.error('Error subscribing:', error);
    res.status(500).json({ message: 'An error occurred while subscribing.' });
  }
}

//TODO: Pass the price 
const createCheckoutSession = async (req, res) => {
  const currentDate = new Date();
  const formatter = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short'
  });
  const date = formatter.format(currentDate);
  try {
    const { eventId, email, name } = req.body;
    const selectedEvent = await Event.findById(eventId);
    const price = await stripe.prices.retrieve(selectedEvent.price);
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        customer_email: email,
        mode: 'payment', 
        line_items: [{
          price: price.id,
          quantity: 1,
        }],
        success_url: `http://localhost:3000/payment-success/${eventId}/info?data=${date}&price=100&name=${name}`,
        cancel_url: `http://localhost:3000/view-event-page/${eventId}`,
        metadata: {
          eventId: eventId,
          email: email,
        },
      });
      res.status(200).json({ url: session.url });
    } catch (error) {
      console.log('Error buying the product:', error);
      res.status(500).json({ message: 'An error occurred while buying the product.' });
    }
  };

const getStripeDetails = async (req, res) => {
    const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
    const customer = await stripe.customers.retrieve(session.customer);

}

//@desc Get the price of an event by ID
//@route GET/api/events/:id/price
//@access Private

const getEventPrice = async (req, res) => {
  try {
    const eventId = req.params.id;
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    const priceId = event.price;
    if (!priceId) {
      return res.status(404).json({ message: 'This event has no price' });
    }
    const price = await stripe.prices.retrieve(priceId);
    res.status(200).json({unit_amount: price.unit_amount/100, currency: price.currency})
  } catch (error) {
    console.log('Error getting the price of the event', error);
    res.status(500).json({ message: 'Error getting the price of the event' });
  }
}

// const resend = new Resend(process.env.RESEND_API_KEY);

// const resendPayment = async () => {
//   await resend.sendEmail({
//     from:'onboarding@resend.dev',
//     to: 'lefteris.katsama@gmail.com',
//     subject:'Successful Payment',
//     react: WelcomeEmail(),
//   });
//   return res.status(200).json({
//     status: 'Ok'
//   })
// }
  
const stripeWebhook = async (req, res) => {
  const payload = req.rawBody;
  const sig = req.headers['stripe-signature'];
  const endpointSecret = "whsec_95e192372834d11e170a27b4e4999d0ffec7a54f79ba63ca5c0aa3220ecb730c";

  try {
    const event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const paymentIntent = event.data.object;
        const eventId = paymentIntent.metadata.eventId;
        const email = paymentIntent.metadata.email;
        console.log('Payment succeeded:', paymentIntent.id);
        try {
          const event = await Event.findById(eventId);
      
          if (!event) {
            return res.status(404).json({ message: 'Event not found' });
          }
      
          const registrant = event.registrants.find(reg => reg.email === email);

          if (!registrant) {
            return res.status(404).json({ message: 'Registrant not found' });
          }

          registrant.isSubscribed = true;

          await event.save();
      
          res.status(200).json(updatedEvent);
        } catch (error) {
          res.status(500).json({ message: 'Error updating event' });
        }

        // sendEmail(email, 'Successful Payment', 'Thank you for choosing our services!');
        // resendPayment();
        const params = {
          Source: 'lefteris.katsamagas@scigentech.com',
          Destination: {
            ToAddresses: [email],
          },
          Message: {
            Subject: {
              Data: 'Successful Payment',
            },
            Body: {
              Text: {
                Data: 'Thank you for choosing our services!',
              },
            },
          },
        };

        ses.sendEmail(params, (err, data) => {
          if (err) {
            console.error('Error sending email:', err);
          } else {
            console.log('Email sent:', data);
          }
        });

        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
      break;
    }

    // Return a 200 response to acknowledge receipt of the event
    res.status(200).end();
  } catch (err) {
    console.error('Webhook Error:', err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
};


// const sendEmail = (to, subject, text) => {
//   const transporter = nodemailer.createTransport({
//     service: 'Gmail',
//     auth: {
//       user: 'lefteris.katsamagas@scigentech.com', // Your email address
//       pass: process.env.EMAIL_PASSWORD, // Your email password
//     },
//   });

//   const mailOptions = {
//     from: 'lefteris.katsamagas@scigentech.com', // Sender's email address
//     to: to, // Recipient's email address
//     subject: subject,
//     text: text,
//   };

//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       console.log('Email error:', error);
//     } else {
//       console.log('Email sent:', info.response);
//     }
//   });
// };


export {
  createEvent,
  deleteEvent,
  updateEvent,
  getAllEvents,
  getEventById,
  subscribe,
  createCheckoutSession,
  getEventPrice,
  stripeWebhook,
  upload,
};
