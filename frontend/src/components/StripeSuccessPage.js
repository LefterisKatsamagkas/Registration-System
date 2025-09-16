import React, { useState, useEffect } from 'react';
import { getEventById } from '../Api/eventApi';
import { useParams } from 'react-router-dom';
import '../App.css';
import Spinner from 'react-spinner-material';
import dayjs from 'dayjs';

const StripeSuccessPage = () => {
    const [loading, setLoading] = useState(true);
    const [thisEvent, setThisEvent] = useState('');
    
    const { id } = useParams();
    const eventId = id;

    
    useEffect(() => {
        const fetchData = async () => {
          try {
            const event = await getEventById(eventId);
            setThisEvent({...event});
          } catch (error) {
            console.error('Error fetching event:', error);
          } finally {
            setLoading(false);
          }
        };
      
        fetchData();
      }, [eventId]);

    return (
        <div className='registrant-page'>
            <div className='showcase-event-info'>
                {loading ? (
                    <Spinner radius={120} color={"#fff"} stroke={2} visible={true} style={{position:"relative"}}/>
                ) : (
                    <div className='grid-container'>
                    <div className='image-and-info'>
                        {thisEvent.banner ? (
                            <div className='background-image' style={{ backgroundImage: `url(${thisEvent.banner})` }}></div>
                        ): (
                            <div className='background-image' style={{ background: '#6448ef' }}></div>
                        )}
                      <div className='showcase-title-description'>
                              <h1>{thisEvent.name}</h1>
                              <p className='event-desc'>{thisEvent.description}</p>
                              <p className='showcase-startEvent'    ><i class="fas fa-calendar-alt"></i> {dayjs(thisEvent.startDate).format('MMMM D')} - {dayjs(thisEvent.endDate).format('MMMM D, YYYY')}</p>
                      </div>
                  </div>
                    <div className='success-form card'>
                        <h2>Success!</h2>
                        <p>Your payment has been completed successfully.</p>
                        <div className='green-check'>
                            <i class="fas fa-check"></i>
                        </div>
                    </div>
                </div>
                )}
            </div>
        </div>
    );
};

export default StripeSuccessPage;
