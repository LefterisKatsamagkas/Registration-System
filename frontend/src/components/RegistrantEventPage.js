import React, { useState, useEffect } from 'react';
import FormContainer from '../components/FormContainer';
import { Form } from 'react-bootstrap';
import { subscribeToEvent, getEventById, createStripePayment } from '../Api/eventApi';
import { useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import '../App.css';
import { useNavigate } from 'react-router-dom';
import Spinner from 'react-spinner-material';
import dayjs from 'dayjs';
import axios from 'axios';

const RegistrantEventPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const [isRegistered, setIsRegistered] = useState(false);
    const [thisEvent, setThisEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [price, setPrice] = useState('');
    const [showSubscribeForm, setShowSubscribeForm] = useState(false);
    const [infoPosition, setInfoPosition] = useState('centered');
    

    const navigate = useNavigate();

    // TODO: Change id to eventid
    const { id } = useParams();
     const eventId = id;

    const isFormValid = name !== '' && email !== '' && phoneNumber !== '' && address !== '' && email.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/);

    const checkIfSubscribed = () => {
        if (thisEvent) {
            const subscribedUser = thisEvent.registrants.find(registrant => registrant.email === email);
            if (subscribedUser) {
                setIsRegistered(true);
            } else {
                setIsRegistered(false);
            }
        }
    };

    useEffect(() => {
        checkIfSubscribed();
    }, [email, thisEvent]);

    const subscribeHandler = async () => {
        if(isRegistered) {
            toast.error('You are already registered to this event')
        } else {
            const subscribeData = {
                eventId: eventId,
                name: name,
                email: email,
                phoneNumber: phoneNumber,
                address: address,
                isSubscribed: false,
            };
            try {
                const response = await subscribeToEvent(eventId, subscribeData);
                fetchData();
            } catch (error) {
                console.error('Error subscribing:', error);
            }
        }
    };

    const buyHandler = async (e) => {
        e.preventDefault();
        const buyData = {
            eventId,
            email,
            name,
        };
        try {
            subscribeHandler();
            const response = await createStripePayment(buyData);
            window.location = response.url;

        } catch (error) {
            console.log('Error buying the product:', error);
        }
    }

    const fetchData = async () => {
        try {
            const event = await getEventById(eventId);
            setThisEvent({...event});
        } catch (error) {
            console.error('Error fetching event:', error);
        } finally {
            setLoading(false);
        }
    }

    function getCurrencySymbol(currencyCode) {
        const currencySymbols = {
          usd: '$',
          eur: '€',
        };
      
        return currencySymbols[currencyCode] || currencyCode;
      }

    const getEventPrice = async () => {
        try {
          const response = await axios.get(`/api/events/${eventId}/price`);
          setPrice(response.data.unit_amount + getCurrencySymbol(response.data.currency));
        } catch (error) {
            console.log(error);
        }
      } 

    const joinHandler = async (e) => {
        e.preventDefault();
        setShowSubscribeForm(true);
        setInfoPosition('to-the-left');
    }

    useEffect(() => {
        fetchData();
        getEventPrice();
    }, [eventId]);

    return (
        <div className='registrant-page'>
            <div className='showcase-event-info'>
                    {loading ? (
                        <Spinner radius={120} color={"#fff"} stroke={2} visible={true} style={{position:"relative"}}/>
                    ) : (
                    <div className={`grid-container ${infoPosition}`}>
                        <div className='image-and-info'>
                            {thisEvent.banner ? (
                                <div className='background-image' style={{ backgroundImage: `url(${thisEvent.banner})` }}></div>
                            ): (
                                <div className='background-image' style={{ background: '#6448ef' }}></div>
                            )}
                          <div className='showcase-title-description'>
                              <h1>{thisEvent.name}</h1>
                              <p>{thisEvent.description}</p>
                              <p className='showcase-startEvent' ><i class="fas fa-calendar-alt"></i> {dayjs(thisEvent.startDate).format('MMMM D')} - {dayjs(thisEvent.endDate).format('MMMM D, YYYY')}</p>
                              <p> <i class="fas fa-credit-card"></i> {price} in advance</p>
                              {infoPosition==='centered' && (
                                  <button className='join-btn' onClick={joinHandler}>Join Now!</button>
                              )}
                          </div>
                      </div>
                      {showSubscribeForm && (
                        <div className='subscribe-form card'>
                        <h4>Subscribe to the Event</h4>
                            <FormContainer xs={12} md={20} className='needs-validation'>
                                <Form.Group controlId="name" className="was-validated py-3">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter your name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        style={{ width: '100%' }}
                                        required
                                    />
                                    <div className='invalid-feedback position-absolute my-1'>
                                        Name is required
                                    </div>
                                </Form.Group>
                                <Form.Group controlId="email" className="was-validated py-3">
                                    <Form.Label>Email Address</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        style={{ width: '100%' }}
                                        required
                                    />
                                        { isRegistered ? (
                                            <div className='invalid-feedback position-absolute my-1'>
                                                Email is already registered
                                            </div>
                                        ) : (
                                            <div className='invalid-feedback position-absolute my-1'>
                                                Email is required
                                            </div>
                                        )}
                                </Form.Group>
                                <Form.Group controlId="phoneNumber" className="was-validated py-3">
                                    <Form.Label>Phone number</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter your phone number"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        style={{ width: '100%' }}
                                        required
                                    />
                                    <div className='invalid-feedback position-absolute my-1'>
                                        Phone number is required
                                    </div>
                                </Form.Group>
                                <Form.Group controlId="address" className="was-validated py-3">
                                    <Form.Label>Address</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter your address"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        style={{ width: '100%' }}
                                        required
                                    />
                                    <div className='invalid-feedback position-absolute my-1'>
                                        Adress is required
                                    </div>
                                </Form.Group>
                                <button className='subscribe-btn' onClick={buyHandler} disabled={!isFormValid || isRegistered}>Subscribe</button>

                            </FormContainer>
                        </div>
                      )}
            </div>
                    )}
        </div>
    </div>
    );
};

export default RegistrantEventPage;
