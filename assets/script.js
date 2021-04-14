// initialize some state variablr
let nav = 0 ;
// this is to kepp track in which month the calendar is
let clicked = null;
// for the clickanble day in the calendar
let events;
if(localStorage.getItem('events')){
    events = JSON.parse.localStorage.getItem('events');
}else {
    events = [];
}

// initialize event and then load event from localStorage. If there is no event set event to an empty array

// initialize some constant variable
const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const calendar = document.getElementById('calendar');
const newEventModal = document.getElementById('newEventModal');
const deleteEventModal = document.getElementById('deleteEventModal');
const backDrop = document.getElementById('modalBackDrop');
const eventTitleInput = document.getElementById('eventTitleInput');

function openModal(date) {
  clicked = date;

  const eventForDay = events.find(e => e.date === clicked);

  if (eventForDay) {
    document.getElementById('eventText').innerText = eventForDay.title;
    deleteEventModal.style.display = 'block';
  } else {
    newEventModal.style.display = 'block';
  }

  backDrop.style.display = 'block';
}

function closeModal() {
  eventTitleInput.classList.remove('error');
  newEventModal.style.display = 'none';
  deleteEventModal.style.display = 'none';
  backDrop.style.display = 'none';
  eventTitleInput.value = '';
  clicked = null;
  load();
}

function saveEvent() {
  if (eventTitleInput.value) {
    eventTitleInput.classList.remove('error');

    events.push({
      date: clicked,
      title: eventTitleInput.value, 
    });

    localStorage.setItem('event', JSON.stringify(events));
    closeModal();
  } else {
    eventTitleInput.classList.add('error');
  }
}



// initialize function load
function load(){
    // load the current day for references
    const dt = new Date();

    if (nav !== 0) {
    dt.setMonth(new Date().getMonth() + nav);
    }

    // get the date month and year from dt
    const date = dt.getDate();
    const month = dt.getMonth();
    const year = dt.getFullYear();
    // get how many day in this month
    // do this by constructing a new Date onject and passing the value for the next month and the value zero to get the last day in this month
    const daysInMonth = new Date(year, month+1, 0).getDate();
    // get the first date in this month
    const firstDayinMonth = new Date(year, month, 1)
    
    const dateString = firstDayinMonth.toLocaleDateString('en-us', {
        weekday: 'long',
        year: "numeric",
        month: 'numeric',
        day: 'numeric'
    });
    const paddingDays = weekdays.indexOf(dateString.split(', ')[0]);
    let displayMonth = dt.toLocaleDateString('en-us', {month: 'long'});
    document.getElementById('month-display').innerText = `${displayMonth} ${year}`;

    calendar.innerHTML='';
    for(let i=1; i<=paddingDays + daysInMonth; ++i){
        const daySquare = document.createElement('div');
        daySquare.classList.add('day');

        if(i>paddingDays){
            daySquare.innerHTML = i-paddingDays;
            daySquare.addEventListener('click', ()=>openModal(`${month + 1}/${i - paddingDays}/${year}`) );
        }else {
            daySquare.classList.add('padding');
        }

        calendar.appendChild(daySquare);
    }
}

function deleteEvent() {
  events = events.filter(e => e.date !== clicked);
  localStorage.setItem('events', JSON.stringify(events));
  closeModal();
}


function initButtons() {
  document.getElementById('next-button').addEventListener('click', () => {
    nav++;
    load();
  });

  document.getElementById('back-button').addEventListener('click', () => {
    nav--;
    load();
  });

  document.getElementById('saveButton').addEventListener('click', saveEvent);
  document.getElementById('cancelButton').addEventListener('click', closeModal);
  document.getElementById('deleteButton').addEventListener('click', deleteEvent);
  document.getElementById('closeButton').addEventListener('click', closeModal);
}

initButtons();
load();