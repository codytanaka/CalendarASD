// initialize some state variablr
let nav = 0 ;
// this is to kepp track in which month the calendar is
let clicked = null;
// for the clickable day in the calendar
let events;
if(localStorage.getItem('events')){
    events = JSON.parse(localStorage.getItem('events')) ;
}else {
    events = [];
}

// initialize event and then load event from localStorage. If there is no event set event to an empty array

const presentdt = new Date();
const prdate = presentdt.getDate();
const prmonth = presentdt.getMonth();
const pryear = presentdt.getFullYear();
//initialize the present date (the date the program is accessed) for references

// initialize some constant variable
const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const calendar = document.getElementById('calendar');
const newEventModal = document.getElementById('newEventModal');
const deleteEventModal = document.getElementById('deleteEventModal');
const backDrop = document.getElementById('modalBackDrop');
const eventTitleInput = document.getElementById('eventTitleInput');
const updateEventInput = document.getElementById('updateEventInput');

function openModal(date) {
  clicked = date;

  var eventForDay = events.filter(e => e.date === clicked);
 
  //array of events per day

  //display only the event per day (turning it into array)
  var jdd = Object.values(eventForDay).map(Obj => Obj.title); 
  
  // Add the contents 
  document.getElementById('eventText').appendChild(makeUL(jdd));

  addCloseEventButton();
  
  deleteMultipleEvent();

  deleteEventModal.style.display = 'block';
  
  backDrop.style.display = 'block';
  
}

//to turn the array into list 
function makeUL(array) {
    
  // Create the list element:
  var list = document.createElement('ul');
 
 // var myNodelist = document.getElementById('li');

  for (var i = 0; i < array.length; i++) {
      // Create the list item:
      item = document.createElement('li');
     
      // Set its contents:
      item.appendChild(document.createTextNode(array[i]));
     
      //myNodelist[i].appendChild(span);

      // Add it to the list:
      list.appendChild(item);
     
  }



  // Finally, return the constructed list:
  return list;
  

}

//to update the local storage
function updateLocalStorage() {
  const eventEl = document.querySelectorAll("li");
  
  const eventtemp = [];
  
  eventEl.forEach((eventEl) => {
      eventtemp.push({
          date:clicked,
          title:eventEl.firstChild.nodeValue.trim(),
      });
  });
  
  localStorage.setItem("events", JSON.stringify(eventtemp));

}

//to add the close button
function addCloseEventButton(){
  var myNodelist = document.getElementsByTagName('li');
  var i;

  for (i = 0; i < myNodelist.length; i++) {
    var span = document.createElement("SPAN");
    var txt = document.createTextNode("\u00D7");
    span.className = "close";
    span.appendChild(txt);
    myNodelist[i].appendChild(span);
  
  }
}

//to delete the event when the close button is clicked
function deleteMultipleEvent(){

  var close = document.getElementsByClassName("close");
  var i;
  for (i = 0; i < close.length; i++) {
    close[i].onclick = function() {
      var div = this.parentElement;
      div.remove();
      updateLocalStorage();
      
    }
    
  }

} 


function closeModal() {
  eventTitleInput.classList.remove('error');
  newEventModal.style.display = 'none';
  deleteEventModal.style.display = 'none';
  backDrop.style.display = 'none';
  eventTitleInput.value = '';
  updateEventInput.value = '';
  clicked = null;
  document.getElementById('eventText').innerHTML='';
  document.getElementsByClassName('li').innerHTML='';
  load();
  location.reload();
}

//untuk sementara ini gabisa dipake karena ini gabisa edit multiple event
function editEvent(){
  events = events.filter(e => e.date !== clicked);
  localStorage.setItem('events', JSON.stringify(events));

  events.push({
    date: clicked,
    title: updateEventInput.value,
  });
  localStorage.setItem('events', JSON.stringify(events));
  updateEventInput.value="";
  
  closeModal();
}

function saveEvent() {
  if (eventTitleInput.value) {
    eventTitleInput.classList.remove('error');

    events.push({
      date: clicked,
      title: eventTitleInput.value, 
    });

    localStorage.setItem('events', JSON.stringify(events));
    closeModal();
  } else {
    eventTitleInput.classList.add('error');
  }
}

//to add new event
function addNewEvent() {
  if (updateEventInput.value) {
    updateEventInput.classList.remove('error');

    events.push({
      date: clicked,
      title: updateEventInput.value, 
    });

    localStorage.setItem('events', JSON.stringify(events));
    closeModal();
  } else {
    updateEventInput.classList.add('error');
  }
}

// initialize function load
function load(){
    const dt = new Date();
    // load the current day for references
    

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
    //let displayMonth = dt.toLocaleDateString('en-us', {month: 'long'});
    //document.getElementById('month-display').innerText = `${displayMonth}`;
    //document.getElementById('year-display').innerText = `${year}`;
    
    let monthDropdown = document.getElementById('month-display');
    for(let i, j = 0; i = monthDropdown.options[j]; j++){
      if(i.value == month){
        monthDropdown.selectedIndex = j;
        break;
      }
    }
    //set default month selection

    let yearDropdown = document.getElementById('year-display');
    let currentYear = pryear + 20;
    let earliestYear = pryear - 20;
    while(currentYear >= earliestYear){
      let yearOption = document.createElement('option');
      yearOption.text = currentYear;
      yearOption.value = currentYear;
      yearDropdown.add(yearOption);
      currentYear -= 1;
    }
    //create year dropdown list

    for(let i, j = 0; i = yearDropdown.options[j]; j++) {
      if(i.value == year) {
          yearDropdown.selectedIndex = j;
          break;
      }
    }
    //set default year selection

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

//untuk sementara ini jadi delete all (ngapus semua event dlm 1 hari)
function deleteEvent() {
  events = events.filter(e => e.date !== clicked);
  localStorage.setItem('events', JSON.stringify(events));
  closeModal();
}


function initButtons() {
  let prevYear = pryear;
  let prevMonth = prmonth;
  //initialize default value

  document.getElementById('month-display').addEventListener('change', () => {
    let monthDropdown = document.getElementById('month-display');
    nav = nav + (monthDropdown.value - prevMonth);
    prevMonth = monthDropdown.value;
    load();
  })

  document.getElementById('year-display').addEventListener('change', () => {
    let yearDropdown = document.getElementById('year-display');
    nav = nav + ((yearDropdown.value - prevYear)*12);
    prevYear = yearDropdown.value;
    load();
  })

  document.getElementById('next-button').addEventListener('click', () => {
    nav++;
    load();
  });

  document.getElementById('back-button').addEventListener('click', () => {
    nav--;
    load();
  });


  document.getElementById('saveButton').addEventListener('click', saveEvent);
  document.getElementById('addNewEventButton').addEventListener('click', addNewEvent);
  document.getElementById('cancelButton').addEventListener('click', closeModal);
  document.getElementById('editButton').addEventListener('click', editEvent);
  document.getElementById('deleteButton').addEventListener('click', deleteEvent);
  document.getElementById('closeButton').addEventListener('click', closeModal);
}

function startTime() {
  var today = new Date();
  var h = today.getHours();
  var m = today.getMinutes();
  var s = today.getSeconds();
  m = checkTime(m);
  s = checkTime(s);
  document.getElementById('txt').innerHTML =
  h + ":" + m + ":" + s;
  var t = setTimeout(startTime, 1000);
}
function checkTime(i) {
  if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
  return i;
}

startTime();
initButtons();
load();