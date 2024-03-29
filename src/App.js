import './App.css';
import React, { useEffect, useRef, useState } from 'react';

function App() {
  const [first, setFirst] = useState();
  const [last, setLast] = useState();
  const [guest, setGuest] = useState([]);
  // const [attending, setAttending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [refetch, setRefetch] = useState(true);

  const inputFirstName = useRef(null);
  const inputLastName = useRef(null);

  const baseUrl = 'https://react-guest-list-heroku.herokuapp.com';

  // Creates array and fetches data
  useEffect(() => {
    const fetchGuests = async () => {
      const response = await fetch(`${baseUrl}/guests`);

      if (!response.ok) {
        throw new Error('Data could not be fetched!');
      } else {
        const guestsData = await response.json();
        // console.log(guestsData);
        setGuest(guestsData);
        // setAttending(!attending);
        setIsLoading(false);
      }
    };
    fetchGuests().catch(() => {
      console.log('fetch fails');
    });
  }, [refetch]);

  const disabled = isLoading ? true : false;

  // POST function - Add user - send data to server
  async function createUser(firstName, lastName) {
    const response = await fetch(`${baseUrl}/guests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
      }),
    });
    const createdGuest = await response.json();
    // console.log(createdGuest);
    setGuest((add) => [...add, createdGuest]);
    inputFirstName.current.value = '';
    setFirst('');
    inputLastName.current.value = '';
    setLast('');
  }

  // Update attendance
  async function updateAttendance(id, event) {
    const response = await fetch(`${baseUrl}/guests/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ attending: event }),
    });
    const updateGuestList = await response.json();
    setRefetch(!refetch);
    // console.log(updateGuestList);
    console.log(JSON.stringify({ updateGuestList }));
    // setAttending(attending);
    // console.log(attending);
  }

  // Delete guest
  async function deleteGuest(id) {
    const response = await fetch(`${baseUrl}/guests/${id}`, {
      method: 'DELETE',
    });
    const deleteAGuest = await response.json();
    console.log(deleteAGuest);
    setRefetch(!refetch);
    // setAttending(!attending);
    setGuest(() => guest.filter((guests) => guests.id !== id));
    // console.log(setGuest);
  }

  return isLoading ? (
    <h2>Loading...</h2>
  ) : (
    <div>
      <label>
        First name
        <br />
        <input
          value={first}
          ref={inputFirstName}
          onChange={(event) => {
            setFirst(event.currentTarget.value);
          }}
          disabled={disabled}
        />
      </label>
      <label>
        <br />
        Last name
        <br />
        <input
          value={last}
          ref={inputLastName}
          onChange={(event) => {
            setLast(event.currentTarget.value);
          }}
          onKeyPress={(event) => {
            // setLast(event.currentTarget.value);
            if (event.key === 'Enter') {
              event.preventDefault();
              setIsLoading(true);
              setRefetch(!refetch);
              inputFirstName.current.value = '';
              setFirst('');
              inputLastName.current.value = '';
              setLast('');

              createUser(first, last).catch(() => {
                console.log('fetch fails');
              });
            }
          }}
          disabled={disabled}
        />
      </label>

      <br />
      {/* <button
        onClick={() => {
          createUser(first, last).catch(() => {
            console.error('fetch fails');
          });
        }}
        disabled={disabled}
      >
        Add guest
      </button> */}

      <div>
        <ul>
          {guest.map((guests) => {
            return (
              <div key={guests.id} data-test-id="guest">
                <li>
                  {guests.firstName} {guests.lastName}
                  <label>
                    <p> Attending ? </p>
                    <input
                      aria-label="attending"
                      type="checkbox"
                      checked={guests.attending}
                      onChange={(event) => {
                        const guestTarget = event.currentTarget.checked;
                        // console.log(guests.attending);
                        guests.attending = true;
                        console.log(guests.attending);

                        updateAttendance(guests.id, guestTarget).catch(() => {
                          console.log('error on updating attendance');
                        });
                      }}
                    />
                    {guests.attending ? '✔' : '⛔'}
                  </label>
                  <button
                    aria-label={`Remove ${guests.firstName} ${guests.lastName}`}
                    onClick={() => deleteGuest(guests.id)}
                  >
                    Delete
                  </button>
                </li>
              </div>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default App;
