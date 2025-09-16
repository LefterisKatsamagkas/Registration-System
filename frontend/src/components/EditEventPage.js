import React, { useEffect, useState } from 'react';
import FormContainer from '../components/FormContainer';
import { Form } from 'react-bootstrap';
import { updateEvent } from '../Api/eventApi';
import { useAuth } from '../context/authContext';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import DatePickerValue from './DatePicker';

const DESCRIPTION_CHAR_LIMIT = 400; // Set the character limit for description

function DescriptionInput({ value, onChange, selectedEvent }) {
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
        value={value}
        onChange={handleInputChange}
      />
      <small>
        {DESCRIPTION_CHAR_LIMIT - value.length} characters remaining
      </small>
    </div>
  );
}

function EditEventPage({ onEditEvent, onSuccess, selectedEvent }) {
  const [eventName, setEventName] = useState(selectedEvent.name);
  const [description, setDescription] = useState(selectedEvent.description);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [bannerPhoto, setBannerPhoto] = useState('');
  const [unitAmount, setUnitAmount] = useState('');
  const [currency, setCurrency] = useState('eur');
  const [isLoading, setIsLoading] = useState('');

  useEffect(() => {
    console.log(startDate);
}, [])

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`/api/events/${selectedEvent._id}/price`);
        setUnitAmount(response.data.unit_amount);
        setCurrency(response.data.currency);
        setIsLoading(false);
      } catch (error) {
        console.error('Error getting the price', error);
      }
    };
  
    fetchPrice();
  
  }, []);

  const { userInfo } = useAuth();

  const submitHandler = async (e) => {
    e.preventDefault();
    let event_amount = unitAmount
    if (unitAmount <= 0){
      event_amount = 0;
    }
    const event_currency = currency;
    try {
      const response = await updateEvent(selectedEvent._id, eventName, description, startDate, endDate, event_amount, event_currency, bannerPhoto);
      toast.success('You updated the event successfully');
      onEditEvent(); // Close the modal after updating the event
      onSuccess();
    } catch (error) {
      toast.error(error?.data?.message || 'Something went wrong');
    }
  };

  return (
    <FormContainer>
      {!isLoading && (
        <Form onSubmit={submitHandler}>
          <Form.Group controlId='eventName' className='my-3'>
            <Form.Label>Event name</Form.Label>
            <Form.Control
              type='eventName'
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId='description' className='my-3'>
            <DescriptionInput value={description} onChange={setDescription} selectedEvent={selectedEvent}/>
          </Form.Group>


          <DatePickerValue onStartDateSubmit={setStartDate} onEndDateSubmit={setEndDate} initialDate= {selectedEvent.startDate} finalDate = {selectedEvent.endDate}/>

          <Form.Group controlId='unitAmount' className='my-3'>
            <Form.Label>Price</Form.Label>
            <Form.Control
              className='price-form'
              type='text'
              value={unitAmount}
              onChange={(e) => setUnitAmount(e.target.value)}
            />
            <select className="form-select" aria-label="Default select example" value={currency} onChange={(e) => setCurrency(e.target.value)} style={{width:'160px', position: 'absolute', bottom:'150px',left:'267px'}}>
              <option defaultValue="eur">Select currency</option>
              <option value="eur">Euro</option>
              <option value="usd">Dollar</option>
            </select>
          </Form.Group>
          <Form.Group controlId='banner' className='my-3'>
            <Form.Label>Change Banner Image</Form.Label>
            <Form.Control
              type='file'
              name='banner'
              accept='image/*'
              onChange={(e) => setBannerPhoto(e.target.files[0])}
            />
          </Form.Group>
          <button className='submit-btn' type='submit'>
            Save
          </button>
        </Form>
      ) }
    </FormContainer>
  );
}

export default EditEventPage;
