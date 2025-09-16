import React, { useState, useEffect } from 'react';
import { getEventById  } from '../Api/eventApi';
import { useParams } from 'react-router-dom';
import Searchbar from './searchbar';
import '../App.css';
import ExcelExporter from '../utils/ExcelExporter';
import Spinner from 'react-spinner-material'; 
import axios from 'axios';
import dayjs from 'dayjs';

function AdminEventPage() {

    const [thisEvent, setThisEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [registrants, setRegistrants] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [price, setPrice] = useState('');
    const registrantsPerPage = 20;

    const { id } = useParams();
    const eventId = id;

    const fetchData = async () => {
        try {
            const event = await getEventById(eventId);
            setThisEvent(event);
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
        console.log('ERRORRR')
      }
    } 

    useEffect(() => {
        fetchData();
        // setPrice(response.data.unit_amount, '+', response.data.currency);
        getEventPrice();
        console.log(price);
    }, [eventId]);

    useEffect(() => {
      console.log(price);
  }, [price]);

    useEffect(() => {
        if (loading === false) {
            const eventRegistrants = thisEvent.registrants || [];
            setRegistrants(eventRegistrants);
        }
    }, [thisEvent]);


    const columnConfig = [
      { key: '_id', name: 'id' },
      {key: 'name', name: 'Full name'},
      {key: 'email', name: 'Email'},
      {key: 'phoneNumber', name: 'Phone Number'},
      {key: 'address', name: 'Address'},
      { key: 'isSubscribed', name: 'Subscribed' },
    ];

    const handleExportToExcel = () => {
        ExcelExporter(registrants, 'Registrants', columnConfig);
    };
    
    // Calculate the indexes of registrants to display for the current page
    const startIndex = (currentPage - 1) * registrantsPerPage;
    const endIndex = startIndex + registrantsPerPage;

    // Extract registrants for the current page
    const registrantsToDisplay = registrants.slice(startIndex, endIndex);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };


  return (
    <div className='admin-page'>
        <div className='event-info'>
            <div className='container grid'>
                    {loading ? (
                      <Spinner radius={120} color={"#6448ef"} stroke={2} visible={true} style={{position:"relative", left: "100%"}}/>
                    ) : (
                      <div className='image-and-info'>
                          <div className='background-image' style={{ backgroundImage: `url(${thisEvent.banner})` }}></div>
                          <div className='showcase-title-description'>
                              <h1>{thisEvent.name}</h1>
                              <p className='event-desc'>{thisEvent.description}</p>
                              <p className='showcase-startEvent' ><i class="fas fa-calendar-alt"></i> {dayjs(thisEvent.startDate).format('MMMM D')} - {dayjs(thisEvent.endDate).format('MMMM D, YYYY')}</p>
                              <p> <i class="fas fa-credit-card"></i> {price} in advance</p>
                          </div>
                      </div>
                    )}
                {registrants && (
            <div className='showcase-registrants'>
              <Searchbar value={searchQuery} setValue={setSearchQuery} />
              <h3 id='registrants-h3'>Registrants</h3>
              {registrants.length > 0 ? (
                <div>
                  <ul>
                    {registrantsToDisplay
                      .filter((registrant) =>
                        registrant.name.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .map((registrant, _id) => (
                        <li key={_id}>{registrant.name}</li>
                      ))}
                  </ul>
                  {/* Pagination */}
                  <div className='pagination'>
                    {Array.from({ length: Math.ceil(registrants.length / registrantsPerPage) }).map((_, index) => (
                      <button
                        key={index}
                        className={currentPage === index + 1 ? 'active' : ''}
                        onClick={() => handlePageChange(index + 1)}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>
                  <button
                    className='export-btn'
                    onClick={() => handleExportToExcel()}
                  >
                    <i class="fas fa-sign-out fa-rotate-270"></i>
                    {' '}
                     Export
                  </button>
                </div>
              ) : (
                <p>0 Registrants for the moment</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminEventPage;