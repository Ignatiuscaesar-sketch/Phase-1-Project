document.addEventListener('DOMContentLoaded', () => {
    fetchEvents();
    const form = document.getElementById('eventForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        postEvent();
    });
});

function fetchEvents() {
    fetch('https://my-project-j0bk.onrender.com/events')
        .then(response => response.json())
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


function postEvent() {
    const eventData = {
        name: document.getElementById('name').value,
        location: document.getElementById('location').value,
        dates: document.getElementById('dates').value,
        category: document.getElementById('category').value,
        description: document.getElementById('description').value,
    };

    fetch('https://my-project-j0bk.onrender.com/events', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
    })
    .then(response => response.json())
    .then(() => {
        alert('Event added successfully!');
        fetchEvents(); // Refresh the events list
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to add the event.');
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

function postComment(eventId) {
    const commentInput = document.getElementById(`comment-input-${eventId}`);
    const commentText = commentInput.value;

    //POST request to add a comment
    fetch(`https://my-project-j0bk.onrender.com/events/${eventId}/comments`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ comment: commentText }),
    })
    .then(() => {
        fetchEvents(); // Reload events to display the new comment
        commentInput.value = ''; // Clear the input field
    })
    .catch(error => console.error('Error:', error));
}


function buyTicket(eventId, ticketsToBuy = 1) {
    const ticketsAvailableElement = document.getElementById(`tickets-available-${eventId}`);
    
    fetch(`https://my-project-j0bk.onrender.com/events/${eventId}/buy-ticket`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tickets: ticketsToBuy }),
    })
    .then(response => {
        if (!response.ok) {
            // If the response is not 2xx, it will throw an error and catch block will handle it
            throw new Error(`Network response was not ok, status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            // Update the UI with the new ticket count
            ticketsAvailableElement.textContent = data.ticketsAvailable;
            alert('Ticket purchased successfully!');
        } else {
            // If the data.success is false, handle it accordingly
            alert('Failed to purchase ticket: ' + data.message);
        }
    })
    .catch(error => {
        // Catch any errors that occur during the fetch process
        console.error('Error:', error);
        alert('Failed to purchase ticket. See console for details.');
    });
}


// Simulated function to fetch events and populate the category dropdown
function loadEventCategories() {
    // Simulate fetching data from db.json
    // In a real app, this would be an API request to your server
    const events = [
        // Assuming your db.json events array is accessible here
    ];

    const categorySelect = document.getElementById('category');
    const uniqueCategories = [...new Set(events.map(event => event.category))];

    uniqueCategories.forEach(category => {
        const optionElement = document.createElement('option');
        optionElement.value = category.toLowerCase();
        optionElement.textContent = category;
        categorySelect.appendChild(optionElement);
    });
}

// Adjusted submitForm function
function submitForm(event) {
    event.preventDefault();

    // Collect form data as before
    // ...

    // Here, you would typically make an API call to your server to create the booking
    // For demonstration, we'll simply update the UI as if the booking was successful

    // Show booking details and a success message
    document.getElementById('bookingDetails').classList.remove('hidden');
    document.getElementById('successMessage').textContent = 'Booking Successful!';
}

// Call loadEventCategories on page load
window.onload = function() {
    loadEventCategories();
    changeSeatType(); // Ensure this is called to initialize the seat type selection
};

document.getElementById('eventForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const newEvent = {
        name: document.getElementById('name').value,
        location: document.getElementById('location').value,
        dates: document.getElementById('dates').value,
        category: document.getElementById('category').value,
        description: document.getElementById('description').value,
    };

    // Send this data to your server
    fetch('/events', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEvent),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        // Optionally, add code to update the UI with the new event
    })
    .catch((error) => {
        console.error('Error:', error);
    });

    // Reset the form after submission
    event.target.reset();
});
