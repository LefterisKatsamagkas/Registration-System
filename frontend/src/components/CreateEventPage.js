import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { createEvent } from '../Api/eventApi';
import { useAuth } from '../context/authContext';
import { Form, Button } from 'react-bootstrap';
import FormContainer from './FormContainer';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import DatePickerValue from './DatePicker';

const DESCRIPTION_CHAR_LIMIT = 400;

function DescriptionInput({ value, onChange }) {
  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    if (inputValue.length <= DESCRIPTION_CHAR_LIMIT) {
      onChange(inputValue);
    }
  };

  return (
    <div>
      <Form.Label>Event description</Form.Label>
      <Form.Control
        as='textarea'
        rows={4}
        placeholder="Enter your event's description"
        value={value}
        onChange={handleInputChange}
      />
      <small>
        {DESCRIPTION_CHAR_LIMIT - value.length} characters remaining
      </small>
    </div>
  );
}

function CreateEventPage({ onCreateEvent, onSuccess }) {
  const [eventName, setEventName] = useState('');
  const [description, setDescription] = useState('');
  const [bannerPhoto, setBannerPhoto] = useState(null);
  const [unitAmount, setUnitAmount] = useState('');
  const [currency, setCurrency] = useState('eur');
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  const { userInfo } = useAuth();

  const submitHandler = async (e) => {
    e.preventDefault();

    let event_amount = unitAmount
    if (unitAmount <= 0){
      event_amount = 0;
    }
    const event_currency = currency;

    try {
      const response = await createEvent(eventName, description, userInfo._id, startDate, endDate, event_amount, event_currency, bannerPhoto);
      toast.success('Event created successfully');
      console.log(endDate);
      onCreateEvent();
      onSuccess();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <FormContainer className='create-event'>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId='eventName' className='my-3'>
          <Form.Label>Event name</Form.Label>
          <Form.Control
            type='text'
            placeholder="Enter your event's name"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId='description' className='my-3'>
        <DescriptionInput value={description} onChange={setDescription} />
        </Form.Group>

        <DatePickerValue onStartDateSubmit={setStartDate} onEndDateSubmit={setEndDate} initialValue= {''}/>

        <Form.Group controlId='unitAmount' className='my-3'>
          <Form.Label>Price</Form.Label>
          <Form.Control
            className='price-form'
            type='text'
            placeholder="Enter the subscription price"
            value={unitAmount}
            onChange={(e) => setUnitAmount(e.target.value)}
          />
          <select className="form-select" aria-label="Default select example" onChange={(e) => setCurrency(e.target.value)} style={{width:'160px', position: 'absolute', bottom:'150px',left:'267px'}}>
            <option defaultValue="eur">Select currency</option>
            <option value="eur">Euro</option>
            <option value="usd">Dollar</option>
          </select>
        </Form.Group>
        <Form.Group controlId='banner' className='my-3'>
          <Form.Label>Banner Image</Form.Label>
          <Form.Control
            type='file'
            name='banner'
            accept='image/*'
            onChange={(e) => setBannerPhoto(e.target.files[0])}
          />
        </Form.Group>

        <button className='submit-btn' type='submit'>
          Create
        </button>
      </Form>
    </FormContainer>
  )
}
export default CreateEventPage;