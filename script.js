// Get HTML contents
const calendar = document.querySelector('.calendar');
const eventForm = document.querySelector('#event-form'); // Fixed selector as noted earlier
const closeBtn = document.getElementById('close-btn');
const eventTitle = document.getElementById('event-title');
const eventDescription = document.getElementById('event-description');
const saveEventBtn = document.getElementById('save-event-btn');
const deleteEventButton = document.getElementById('delete-event-btn');

let selectedDate = null;
let events = JSON.parse(localStorage.getItem('events')) || {};
let viewMode = 'monthly'; // New variable to track view mode

const currentDate = new Date();
const currentYear = currentDate.getFullYear();
let currentMonth = currentDate.getMonth();

// Create tooltip div
const tooltip = document.createElement('div');
tooltip.className = 'tooltip';
document.body.appendChild(tooltip);

function generateCalendar() {
    calendar.innerHTML = "";
    
    const month = document.createElement('div');
    month.classList.add('month');
    
    const monthHead = document.createElement('div');
    monthHead.classList.add('month-head');
    
    const date = new Date(currentYear, currentMonth, 1);
    const monthName = date.toLocaleString('default', { month: 'long' });
    /* Going to next month (currentMonth + 1), and then using date = 0 to get the last date of the previous month */
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate(); // Trick to get num of days of current month
    
    monthHead.innerHTML = `
        <button id="prev-btn">Previous</button>
        <span>${monthName} ${currentYear}</span>
        <button id="next-btn">Next</button>
    `;
    
    calendar.appendChild(monthHead);
    monthHead.querySelector('#prev-btn').addEventListener('click', showPreviousMonth);
    monthHead.querySelector('#next-btn').addEventListener('click', showNextMonth);
    
    for (let i = 1; i <= daysInMonth; i++) {
        const day = document.createElement('div');
        day.classList.add('day');
        day.textContent = i;
        if (events[`${currentMonth}_${i}`]) {
            const marker = document.createElement('div');
            marker.classList.add('event-marker');
            day.appendChild(marker);
            day.addEventListener('mouseenter', (e) => showTooltip(e, events[`${currentMonth}_${i}`].title));
            day.addEventListener('mouseleave', hideTooltip);
        }
        day.addEventListener('click', () => openForm(currentMonth, i));
        month.appendChild(day);
    }
    
    calendar.appendChild(month);
}

function showPreviousMonth() {
    if (currentMonth > 0) {
        currentMonth--;
    } else {
        currentMonth = 11;
        currentYear--;
    }
    generateCalendar();
}

function showNextMonth() {
    if (currentMonth < 11) {
        currentMonth++;
    } else {
        currentMonth = 0;
        currentYear++;
    }
    generateCalendar();
}


// Tooltip functions
function showTooltip(e, title) {
    tooltip.textContent = title;
    tooltip.style.left = `${e.pageX + 10}px`;
    tooltip.style.top = `${e.pageY + 10}px`;
    tooltip.style.visibility = 'visible';
    tooltip.style.opacity = 1;
}

function hideTooltip() {
    tooltip.style.visibility = 'hidden';
    tooltip.style.opacity = 0;
}

function openForm(month, date) {
    selectedDate = `${month}_${date}`;
    
    // Remove 'selected' class from all days
    document.querySelectorAll('.calendar .day.selected').forEach(day => {
        day.classList.remove('selected');
    });

    // Add 'selected' class to the clicked day
    const days = document.querySelectorAll('.calendar .day');
    days.forEach(day => {
        if (parseInt(day.textContent) === date) {
            day.classList.add('selected');
        }
    });

    eventTitle.value = events[`${month}_${date}`]?.title || "";
    eventDescription.value = events[`${month}_${date}`]?.description || "";
    if (eventForm)
        eventForm.style.display = 'block';
}

function closeForm() {
    eventForm.style.display = 'none';
    selectedDate = null;
}

function saveEvent() {
    if (!selectedDate) {
        alert("Please select a date.");
    } else if (!eventTitle.value.trim()) {
        alert("Please enter a title.");
    } else {
        events[selectedDate] = {
            title: eventTitle.value.trim(),
            description: eventDescription.value.trim()
        };
        localStorage.setItem("events", JSON.stringify(events));
        generateCalendar();
        closeForm();
    }
}

function deleteEvent() {
    if (!selectedDate) {
        alert("Please select a date.");
    } else {
        delete events[selectedDate];
        localStorage.setItem("events", JSON.stringify(events));
        generateCalendar();
        closeForm();
    }
}

// Event listeners
closeBtn.addEventListener('click', closeForm);
saveEventBtn.addEventListener('click', saveEvent);
deleteEventButton.addEventListener('click', deleteEvent);

window.addEventListener('click', (e) => {
    if (e.target == eventForm) {
        closeForm();
    }
});

window.onload = () => generateCalendar();