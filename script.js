

document.addEventListener('DOMContentLoaded', () => {
    fetchEvents();
    const form = document.getElementById('addEventForm');
    form.addEventListener('submit', addEvent);
});


function fetchEvents() {
    fetch('https://my-project-j0bk.onrender.com/events')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(events => {
            const eventsContainer = document.getElementById('events');
            eventsContainer.innerHTML = events.map(event => `
                <div class="event p-4 bg-white rounded shadow-lg">
                    <h3 class="text-lg font-bold">${event.name}</h3>
                    <p>Location: ${event.location}</p>
                    <p>Dates: ${event.dates}</p>
                    <p>Category: ${event.category}</p>
                    <p>Description: ${event.description}</p>
                    <p>Followers: <span id="followers-${event.id}">${event.followers || 0}</span>
                        <button onclick="addFollower('${event.id}')" class="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Like</button>
                    </p>
                    <p>Rating: <span id="rating-${event.id}">${event.rating || 'Not Rated'}</span></p>
                    ${Array.from({length: 5}, (_, i) => `
                        <button onclick="updateRating('${event.id}', ${i + 1})" class="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded">${i + 1}</button>
                    `).join('')}
                    <p>Tickets Available: <span id="tickets-available-${event.id}">${event.totalTickets - event.ticketsSold}</span></p>
                    <button onclick="buyTicket('${event.id}', 1)" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Buy Ticket</button>
                </div>
            `).join('');
        })
        .catch(error => console.error('Error:', error));
}

function addEvent(event) {
    event.preventDefault();
    console.log('Form is being submitted');
    const formEl = event.target;
    const formData = new FormData(formEl);
    const jsonData = JSON.stringify(Object.fromEntries(formData));

    fetch('https://my-project-j0bk.onrender.com/events', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: jsonData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(result => {
        console.log('Event added:', result);
        fetchEvents(); // Fetch events again to update the list
        formEl.reset(); // Reset the form after successful submission
    })
    .catch(error => {
        console.error('Error adding event:', error);
    });
}

function addFollower(eventId) {
    const followersElement = document.getElementById(`followers-${eventId}`);
    const newFollowerCount = parseInt(followersElement.textContent) + 1;

    fetch(`https://my-project-j0bk.onrender.com/events/${eventId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ followers: newFollowerCount }),
    })
    .then(response => response.json())
    .then(updatedEvent => {
        followersElement.textContent = updatedEvent.followers;
        alert('Follower added successfully!');
    })
    .catch(error => console.error('Error:', error));
}

function updateRating(eventId, rating) {
    const ratingElement = document.getElementById(`rating-${eventId}`);

    fetch(`https://my-project-j0bk.onrender.com/events/${eventId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rating: rating }),
    })
    .then(response => response.json())
    .then(updatedEvent => {
        ratingElement.textContent = updatedEvent.rating;
        alert('Rating updated successfully!');
    })
    .catch(error => console.error('Error:', error));
}

function buyTicket(eventId) {
    const ticketsAvailableElement = `tickets-available-${eventId}`

        const fetchurl = `https://my-project-j0bk.onrender.com/events/${eventId}`
        fetch(fetchurl,{})
        .then(response => response.json())
        .then((tickets) => { 
    if(tickets.totalTickets > tickets.ticketsSold){
        return fetch(fetchurl, {
            method : `PATCH`, 
            headers : {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(
                { ticketsSold: tickets.ticketsSold +1},
                 {totalTickets: tickets.totalTickets -1}
            ), 
        })
    } else{
        console.warn (`No Tickets Available`)
        return Promise.reject(`Wacha Upuss`)
    
    }
        })
        .then(response => response.json())
        .then(updatedEvent => {
            
            ticketsAvailableElement.textContent = updatedEvent.totalTickets;
            alert('Ticket purchased successfully!');
        
        })
        .catch(error => {
    
            console.error('Error:', error);
            alert('Failed to purchase ticket.');
         });
}