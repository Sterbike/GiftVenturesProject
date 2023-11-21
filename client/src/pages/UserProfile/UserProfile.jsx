import React, { Fragment, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import ChangePassword from '../../components/ChangePassword/ChangePassword';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = location.state || {};
    const [savedUser, setSavedUser] = useState(null);
    const [isChangingPassword, setIsChangingPassword] = useState(false); // Hozzáfűztük a jelszóváltoztatás állapotot
    const [userUploads, setUserUploads] = useState([]);
    const [pfp, setpfp] = useState('');

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (userData) {
          setSavedUser(userData);
          getUserData(userData.username)
        }
      }, []);

      const getUserData = async (username) => {
        try {
          const response = await axios.get(`http://localhost:3500/getUserData/${username}`);
          const { user } = response.data;
          setSavedUser(user)
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };

      const handleSaveEdit = async (editedUser) => {
        try {
          const response = await axios.put(`http://localhost:3500/updateUser/${user.username}`, editedUser);
    
          if (response.status === 200) {
            setSavedUser(editedUser); // Frissítjük a felhasználó adatait a mentett változatban
          } else {
            console.error('An error occurred while updating user data.');
          }
        } catch (error) {
          console.error('An error occurred:', error);
        }
      };

      const goToUpload = () => {
        navigate("/upload")
      }
    
      const handleChangePasswordClick = () => {
        setIsChangingPassword(true);
      };
    
      // A jelszóváltoztatás visszavonása
      const handleCancelChangePassword = () => {
        setIsChangingPassword(false);
      };

      const deleteImageHandler = async (uploadId) => {
        let confirmDelete = window.confirm("Biztosan törölni szeretnéd a képet?")
        if (confirmDelete){
          try {
              const response = await axios.delete(`http://localhost:3500/uploads/${uploadId}`);
              console.log(uploadId);
              console.log(response.data); // handle the response as needed
              setUserUploads((prevUploads) => prevUploads.filter((upload) => upload.id !== uploadId));
          } catch (error) {
              console.error("Error while deleting upload:", error);
          }
        }
    };

    
    const setPfp = async (imgUrl) => {
      try {
          const response = await axios.put(`http://localhost:3500/updateUser/${savedUser.username}`, {
              pfp: imgUrl // Assuming the backend expects 'pfp' field to be updated
          });
  
          if (response.status === 200) {
              
              console.log('Profile picture updated successfully');
              setpfp(imgUrl)
          } else {
              console.error('An error occurred while updating the profile picture.');
          }
      } catch (error) {
          console.error('An error occurred:', error);
      }
    };

    const viewImage = (ImageId) =>{
      console.log(ImageId);
      navigate(`/ImagePage/${ImageId}`)
  }

      useEffect(() => {
        const fetchUserUploads = async () => {
            try {
                const response = await axios.get(`http://localhost:3500/uploads/${savedUser.username}`);
                setUserUploads(response.data);
            } catch (error) {
                console.error('An error occurred while fetching user uploads:', error);
            }
        };

        if (savedUser) {
            fetchUserUploads();
            setpfp(savedUser.pfp)
        }
    }, [savedUser]);

  return (
    <div className='userprofile-container'>
        {isChangingPassword ? (
            <ChangePassword user={savedUser || user} onSave={handleSaveEdit} onCancel={handleCancelChangePassword} />
        ) : (
            <Fragment>
            {savedUser || user ? (
                <div>
                  <img src={pfp} alt="User profile picture" id='userpfp' className='userpfp' />
                    <h1>Profil</h1>
                    <table>
                        <tr>
                            <p>Felhasználónév:</p>
                        <td>
                            <p>{savedUser ? savedUser.username : user.username}</p>
                        </td>
                        </tr>
                        <tr>
                            <p>Email:</p>
                        <td>
                            <p>{savedUser ? savedUser.email : user.email}</p>
                        </td>
                        </tr>
                    </table>
                    <button onClick={handleChangePasswordClick}>Jelszó megváltoztatása</button>
                    <button onClick={goToUpload}>Képfeltöltés</button>
                </div>):(
                    <p>Nem vagy bejelentkezve.</p>
                )}
            </Fragment>
        )}
        <div className='userimages'>
          <hr />
            <h2>Feltöltött képek:</h2>
              <div className='images'>
              {userUploads.map((upload) => (
                <div className='image' key={upload._id}>
                  <img onClick={() => viewImage(upload.id)} src={upload.img.cdnUrl} alt={`${upload.desc}`} />
                  <div className='image-desc'>
                    <p className='userprofile-desc'>{upload.desc}</p>
                  </div>
                  <div className="imagebuttons">
                    <button onClick={()=>{deleteImageHandler(upload.id)}} className="delete">Törlés</button>
                    <button className="setpfp" onClick={()=>{setPfp(upload.img.cdnUrl)}}>
                      <img src="/img/add-photo.png"  alt="" />
                    </button>
                  </div>
                  
                </div>
              ))}
            </div>
        </div>
    </div>
  )
}

export default UserProfile