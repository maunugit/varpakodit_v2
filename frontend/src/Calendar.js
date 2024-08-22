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

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [color, setColor] = useState('#03dac6');
  const [loading, setLoading] = useState(false);
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

  const handleAddEvent = async (e) => {
    e.preventDefault();
    if (!title || !start || !end || !color) return;

    setLoading(true);
    try {
      const newEvent = {
        // id: events.length + 1,
        id: Date.now(),
        title,
        start: new Date(start),
        end: new Date(end),
        color,
      };
      const updatedEvents = [...events, newEvent];
      // setEvents([...events, newEvent]);
      setEvents(updatedEvents);
      localStorage.setItem(`calendarEvents_${user.sub}`, JSON.stringify(updatedEvents)); //save events to localStorage, can be changed to save to MongoDB for example
      setTitle('');
      setStart('');
      setEnd('');
      setColor('#03dac6');
    } catch (error) {
      console.error('Error adding event:', error);
    }
    setLoading(false);
  };

  const handleMarkDone = (eventId) => {
    const updatedEvents = events.map(event =>
      event.id === eventId ? { ...event, isDone: true } : event
    );
    setEvents(updatedEvents);
    localStorage.setItem(`calendarEvents_${user.sub}`, JSON.stringify(updatedEvents));
  }

  const eventStyleGetter = (event, start, end, isSelected) => {
    const style = {
      backgroundColor: event.isDone ? '#808080' : event.color || '#03dac6',
      borderRadius: '5px',
      opacity: 0.8,
      color: 'white',
      border: '0px',
      display: 'block'
    };
    return {
      style
    };
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
          onSelectEvent={(event) => handleMarkDone(event.id)}
        />
        <FormGroup>
          <FormControl
            type="text"
            placeholder="Event title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={loading}
          />
          <FormControl
            type="datetime-local"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            disabled={loading}
          />
          <FormControl
            type="datetime-local"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
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
