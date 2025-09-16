import React, { useState, useEffect } from 'react';
import { Modal, Card } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import { useModalContext } from '../context/modalContext'; 
import { getAllEvents, deleteEvent } from '../Api/eventApi';
import CreateEventPage from './CreateEventPage';
import EditEventPage from './EditEventPage';
import Searchbar from './searchbar';
import Spinner from 'react-spinner-material';
import '../App.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat'; // Import the plugin
dayjs.extend(customParseFormat);

const EventPage = () => {
  const { showModal, toggleModal } = useModalContext();
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [ modalOption, setModalOption ] = useState('');
  const [ selectedEvent, setSelectedEvent ] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const { userInfo } = useAuth(); // Use the userInfo

  const fetchEvents = async () => {
    try {
      console.log(userInfo._id);
      setIsLoading(true);
      const eventsData = await getAllEvents(userInfo._id);
      setEvents(eventsData);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleDelete = async (eventId) => {
    try {
      await deleteEvent(eventId);
      toast.success('Event deleted successfully');
      fetchEvents();
    } catch (error) {
      toast.error('Error deleting event');
    }
  };

  const handleCreate = async () => {
    toggleModal();
    setModalOption('create');
  }

  const handleEdit = async (event) => {
    setSelectedEvent(event);
    toggleModal();
    setModalOption('edit');
  }

  const navigate = useNavigate();

  const handleView = async (event) => {
    navigate(`/view-event-page/${event._id}`);
  }

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        console.log(userInfo._id);
        setIsLoading(true);
        const eventsData = await getAllEvents(userInfo._id);
        setEvents(eventsData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents(); // Call the fetchEvents function

    // Rest of the code
  }, [userInfo._id]);


  return (
    <div className='event-page'>
      <div className='add-events'>
        <div className='container'>
          <p id='total-events'>Total Events: {events.length}</p>
          <Searchbar value={searchQuery} setValue={setSearchQuery} />
          <div className='showcase-event'>
          <button className='create-btn' onClick={handleCreate}>
              <div className='btn-content'>
                <span>Click here to create a new event</span>
                <h3>+</h3>
              </div>
            </button>
            {isLoading ? (
              <Spinner radius={120} color={"#6448ef"} stroke={2} visible={true} style={{position:"relative", left:"100%", top:"100px"}}/>
            ) : (
              events
                .filter((event) =>
                  event.name.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((event) => (
                  <Card
                    key={event._id}
                    className={`event-card ${
                      dayjs(event.endDate).isBefore(dayjs()) ? 'grayed-out-card' : ''
                    }`}
                  >
                    <Card.Body>
                      <div className='card-body-container'>
                        <p className='start-date-text'>
                          {dayjs(event.startDate).format('DD MMM').toUpperCase()}
                        </p>
                      {event.banner ? (
                        <div>
                           <img src={event.banner} className="event-banner" alt='event-baner'/>
                           <Card.Title className='card-title' style={{position:'absolute', height:'40px', width: '100%',paddingTop:'10px', transform:'translate(0%,-100%)', color: '#fff', backgroundColor: 'rgba(105,105,105, 0.5)', backdropFilter: 'blur(2px) saturate(90%)'}}>{event.name}</Card.Title>
                        </div>
                        ) : (
                          <Card.Title className='card-title' style={{padding: '10px 0px', margin:'80px 0px',color: '#fff', backgroundColor: 'rgba(105,105,105, 0.5)', backdropFilter: 'blur(2px) saturate(90%)'}}>{event.name}</Card.Title>
                        )}
                        <p className='description-text'>{event.description}</p>

                      </div>
                    </Card.Body>

                    <button
                      className='edit-btn'
                      onClick={() => handleEdit(event)}
                    >
                      Edit
                    </button>
                    <button
                      className='view-btn'
                      onClick={() => handleView(event)}
                    >
                      View Event
                    </button>
                    <button
                      className='delete-btn'
                      onClick={() => handleDelete(event._id)}
                    >
                      Delete
                    </button>
                  </Card>
                ))
            )}
          </div>
        </div>
      </div>
      <Modal show={showModal} onHide={toggleModal} centered>
        <Modal.Header closeButton>
            {modalOption === 'create' ? (
              <Modal.Title style={{ position: 'relative', display: 'block', margin :'0 auto', left:'40px', color: '#6448ef', fontSize: '30px'}}>
                Create a new Event
             </Modal.Title>
            ) : (
              <Modal.Title style={{ position: 'relative', display: 'block', margin :'0 auto', left:'40px', color: '#6448ef', fontSize: '30px'}}>
                Edit the Event
             </Modal.Title>
            )}
        </Modal.Header>
        <Modal.Body>
        {modalOption === 'create' ? (
          <CreateEventPage onCreateEvent={toggleModal} onSuccess={fetchEvents} />
        ) : (
          <EditEventPage onEditEvent={toggleModal} onSuccess={fetchEvents} selectedEvent={selectedEvent}/>
        )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default EventPage;
