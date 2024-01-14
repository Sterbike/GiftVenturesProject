import React, { useEffect, useState } from 'react'
import { useAuthContext } from "../hooks/useAuthContext";
import { useUserdataContext } from "../hooks/useUserdataContext";

const UpdateUserdata = () => {
    const { user } = useAuthContext();
    const { userdata, dispatch } = useUserdataContext();
    const [firstName, setFirstName] = useState(userdata.firstName)
    const [secondName, setSecondName] = useState(userdata.secondName)
    const [email, setEmail] = useState(userdata.email)
    const [mobile, setMobile] = useState(userdata.mobile)
    const [birthDate, setBirthDate] = useState(userdata.birthDate)
    const [placeOfBirth, setPlaceOfBirth] = useState(userdata.placeOfBirth)
    const [address, setAddress] = useState(userdata.address)
    const [displayedMessage, setDisplayedMessage] = useState("")

    useEffect(() => {
        const fetchData = async () => {
          const response = await fetch("http://localhost:3500/api/user/data", {
            headers: {
              'Authorization': `Bearer ${user.token}`,
            },
          });
    
          const json = await response.json();
          console.log(json);
    
          if (response.ok) {
            dispatch({ type: "GET_USERDATA", payload: json });
          }
        };
    
        if (user) {
          fetchData();
        }
      }, [dispatch, user]);
    
      const handleUpdateUser = async (e) => {
        e.preventDefault()
        try {
            const response = await fetch("http://localhost:3500/api/user/update", {
              method: "POST", // Assuming you are sending data as a POST request
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
              },
              body: JSON.stringify({
                email,
                firstName,
                secondName,
                mobile,
                birthDate,
                placeOfBirth,
                address,
              }),
            });
        
            const json = await response.json();
            console.log(json);
        
            if (response.ok) {
            dispatch({ type: "UPDATE_USERDATA", payload: json });
              setDisplayedMessage("Sikeres frissítés")
            } else {
                console.error(`Error updating user: ${response.statusText}`);
              setDisplayedMessage("Sikertelen frissítés")
            }
          } catch (error) {
            console.error('Error updating user:', error);
            // Handle error, maybe show an error message
          }
      }

  return (
    <div>
        <form className='changeDetails' onSubmit={handleUpdateUser}>
        <h1>Adatok megváltoztatása</h1>
            <label>Keresztnév</label>
            <input 
                type="text"
                onChange={(e) => setFirstName(e.target.value)}
                defaultValue={userdata.firstName}
            />
            <label>Vezetéknév</label>
            <input 
                type="text"
                onChange={(e) => setSecondName(e.target.value)}
                defaultValue={userdata.secondName}
            />
            <label>Email</label>
            <input 
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                defaultValue={userdata.email}
            />
            <label>Mobil</label>
            <input 
                type="text"
                onChange={(e) => setMobile(e.target.value)}
                defaultValue={userdata.mobile}
            />
            <label>Születésnap</label>
            <input 
                type="date"
                onChange={(e) => setBirthDate(e.target.value)}
                defaultValue={userdata.birthDate}
            />
            <label>Születési hely</label>
            <input 
                type="text"
                onChange={(e) => setPlaceOfBirth(e.target.value)}
                defaultValue={userdata.placeOfBirth}
            />
            <label>Cím</label>
            <input 
                type="text"
                onChange={(e) => setAddress(e.target.value)}
                defaultValue={userdata.address}
            />
            {displayedMessage && <div className={displayedMessage === "Sikeres frissítés" ? 'success' : 'error'}>{displayedMessage}</div>}
            <div>
                <button type='submit'>Adatok frissítése</button>
                <button type='button'>Jelszó változtatás</button>
            </div>
        </form>
    </div>
    
  )
}

export default UpdateUserdata