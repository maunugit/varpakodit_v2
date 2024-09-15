import React, { useState, useEffect } from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import styled from 'styled-components';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useAuth0 } from '@auth0/auth0-react';

const localizer = momentLocalizer(moment);

const CalendarContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  background-color: #f8f9fa;
  font-family: 'Roboto', sans-serif;
  margin: 0 auto;
  padding: 20px;
`;

const CalendarArea = styled.div`
  flex: 1;
  width: 100%;
  max-width: 1400px;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 30px;
  background-color: #ffffff;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  overflow: hidden; /* Prevent overflow issues */
`;

const StyledBigCalendar = styled(BigCalendar)`
  flex: 1;
  background-color: #ffffff;
  border-radius: 12px;
  border: none;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  
  .rbc-header {
    background-color: #6200ee;
    color: white;
    padding: 5px; /* Reduce padding for header */
    font-weight: bold;
    font-size: 0.9rem; /* Reduce font size for header */
  }

  .rbc-month-view, .rbc-time-view {
    font-size: 1.1rem; /* Increase font size for dates */
  }

  .rbc-event {
    background-color: #03dac6;
    border: none;
    border-radius: 4px;
  }

  .rbc-today {
    background-color: #e8f5e9;
  }

  .rbc-off-range-bg {
    background-color: #f5f5f5;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  background-color: #fff;
  border-top: 1px solid #e0e0e0;
  border-radius: 0 0 12px 12px;
  margin-top: 20px;
`;

const FormControl = styled.input`
  padding: 10px;
  margin-bottom: 15px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px; /* Smaller font size for form control */
  color: #333;
  background-color: #ffffff;
  transition: all 0.3s ease;

  &:focus {
    border-color: #6200ee;
    outline: 0;
    box-shadow: 0 0 0 2px rgba(98, 0, 238, 0.2);
  }
`;

const ColorInput = styled(FormControl)`
  width: 100px;
  padding: 0;
  height: 36px;
`;

const AddButton = styled.button`
  padding: 8px 16px; /* Smaller padding for the button */
  border: none;
  border-radius: 8px;
  background-color: #6200ee;
  color: #ffffff;
  font-size: 14px; /* Smaller font size for the button */
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;

  &:hover {
    background-color: #3700b3;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;
const EventPopover = styled.div`
  position: absolute;
  background: white;
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 5px;
  z-index: 1000;
`;

const PopoverButton = styled.button`
  margin: 5px;
  padding: 5px 10px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  background-color: #6200ee;
  color: white;
  
  &:hover {
    background-color: #3700b3;
  }
`;

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [color, setColor] = useState('#03dac6');
  const [loading, setLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });
  const { user } = useAuth0();

  useEffect(() => {
    if (user) {
      const storedEvents = localStorage.getItem(`calendarEvents_${user.sub}`);
      if (storedEvents) {
        setEvents(JSON.parse(storedEvents).map(event => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end)
        })));
      }
    }
  }, [user]);
  // dummy events for the calendar overlay
  // useEffect(() => {
  //   const dummyEvents = [
  //     {
  //       id: 1,
  //       title: 'Study for Math Exam',
  //       start: new Date(2024, 6, 30, 10, 0),
  //       end: new Date(2024, 6, 30, 12, 0),
  //       color: '#03dac6',
  //     },
  //     {
  //       id: 2,
  //       title: 'Group Project Meeting',
  //       start: new Date(2024, 6, 31, 14, 0),
  //       end: new Date(2024, 6, 31, 16, 0),
  //       color: '#bb86fc',
  //     },
  //   ];
  //   setEvents(dummyEvents);
  // }, []);

  const saveEvents = (updatedEvents) => {
    const eventsToSave = updatedEvents.map(event => ({
      ...event,
      start: event.start.toISOString(),
      end: event.end.toISOString()
    }));
    setEvents(updatedEvents);
    localStorage.setItem(`calendarEvents_${user.sub}`, JSON.stringify(eventsToSave));
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    if (!title || !startDate || !startTime || !endDate || !endTime || !color) return;

    setLoading(true);
    const start = new Date(`${startDate}T${startTime}`);
    const end = new Date(`${endDate}T${endTime}`);
    try {
      const newEvent = {
        // id: events.length + 1,
        id: Date.now(),
        title,
        start,
        end,
        color,
      };
      const updatedEvents = [...events, newEvent];
      // setEvents([...events, newEvent]);
      saveEvents(updatedEvents);
      // localStorage.setItem(`calendarEvents_${user.sub}`, JSON.stringify(updatedEvents)); //save events to localStorage, can be changed to save to MongoDB for example
      setTitle('');
      setStartDate('');
      setStartTime('');
      setEndDate('');
      setEndTime('');
      setColor('#03dac6');
      setLoading(false);
    } catch (error) {
      console.error('Error adding event:', error);
    }
    setLoading(false);
  };

  const handleSelectEvent = (event, e) => {
    setSelectedEvent(event);
    setPopoverPosition({ top: e.pageY, left: e.pageX });
  };

  const handleToggleComplete = () => {
    const updatedEvents = events.map(event => 
      event.id === selectedEvent.id 
        ? { ...event, isCompleted: !event.isCompleted } 
        : event
    );
    saveEvents(updatedEvents);
    setSelectedEvent(null);
  };
  const handleDeleteEvent = () => {
    const updatedEvents = events.filter(event => event.id !== selectedEvent.id);
    saveEvents(updatedEvents);
    setSelectedEvent(null);
  }

  // const handleMarkDone = (eventId) => {
  //   const updatedEvents = events.map(event =>
  //     event.id === eventId ? { ...event, isDone: true } : event
  //   );
  //   setEvents(updatedEvents);
  //   localStorage.setItem(`calendarEvents_${user.sub}`, JSON.stringify(updatedEvents));
  // }

  const eventStyleGetter = (event) => {
    const style = {
      backgroundColor: event.isCompleted ? '#808080' : event.color || '#03dac6',
      borderRadius: '5px',
      opacity: 0.8,
      color: 'white',
      border: '0px',
      display: 'block'
    };
    return { style };
  };

  return (
    <CalendarContainer>
      <CalendarArea>
        <StyledBigCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 'calc(100% - 300px)' }}
          eventPropGetter={eventStyleGetter}
          onSelectEvent={handleSelectEvent}
        />
        {selectedEvent && (
          <EventPopover style={{ top: popoverPosition.top, left: popoverPosition.left }}>
            <PopoverButton onClick={handleToggleComplete}>
              {selectedEvent.isCompleted ? 'Mark as Incomplete' : 'Mark as Completed'}
            </PopoverButton>
            <PopoverButton onClick={handleDeleteEvent}>Delete Event</PopoverButton>
            <PopoverButton onClick={() => setSelectedEvent(null)}>Close</PopoverButton>
          </EventPopover>
        )}
        <FormGroup>
          <FormControl
            type="text"
            placeholder="Event title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={loading}
          />
          <FormControl
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            disabled={loading}
          />
          <FormControl
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            disabled={loading}
          />
          <FormControl
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            disabled={loading}
          />
          <FormControl
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            disabled={loading}
          />
          <ColorInput
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            disabled={loading}
          />
          <AddButton onClick={handleAddEvent} disabled={loading}>
            {loading ? 'Adding...' : 'Add Event'}
          </AddButton>
        </FormGroup>
      </CalendarArea>
    </CalendarContainer>
  );
};

export default Calendar;
