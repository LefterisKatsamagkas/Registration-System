import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  //TODO: Creator-user
  creator: {
    type: String, // Reference to the User model's ObjectId
    required: true,
  },
  startDate: {
    type: Date, // Store the start date and time
    required: true,
  },
  endDate: {
    type: Date, // Store the end date and time
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  banner: {
    type: String, // Store the name of the uploaded banner image
  },
  registrants: [
    {
      name: {
        type: String,
      },
      email: {
        type: String,
      },
      phoneNumber: {
        type: String,
      },
      address: {
        type: String,
      },
      isSubscribed: {
        type: Boolean,
      },
    }
  ],
}, {
  timestamps: true,
});

const Event = mongoose.model('event', eventSchema);

export default Event;