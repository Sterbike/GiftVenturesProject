import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Main = () => {
    const navigate = useNavigate();
    const [uploads, setUploads] = useState([]);
    const [profilePictures, setProfilePictures] = useState({});
    const lightmode = localStorage.getItem("lightmode")

    useEffect(() => {
        const fetchUploads = async () => {
            try {
                const response = await axios.get(`http://localhost:3500/uploads`);
                setUploads(response.data);
            } catch (error) {
                console.error('An error occurred while fetching user uploads:', error);
            }
        };

        fetchUploads();
    }, []);

    const getUserData = async (username) => {
        try {
            const response = await axios.get(`http://localhost:3500/getUserData/${username}`);
            const { user } = response.data;
            return user.pfp;
        } catch (error) {
            console.error('Error fetching user data:', error);
            return ''; // Return a default value or handle the error as needed
        }
    };

    const viewImage = (ImageId) =>{
        console.log(ImageId);
        navigate(`/ImagePage/${ImageId}`)
    }

    useEffect(() => {
        const fetchProfilePictures = async () => {
            const profilePicturesMap = {};
            for (const upload of uploads) {
                const pfp = await getUserData(upload.username);
                profilePicturesMap[upload.username] = pfp;
            }
            setProfilePictures(profilePicturesMap);
        };

        fetchProfilePictures();
    }, [uploads]);

    return (
        <div className='main-container'>
            <h1>Felhasználók által feltöltött képek:</h1>
            <div className='Allimages'>
                <div className='images'>
                    {uploads.map((upload) => (
                        <div className='card' key={upload._id}>
                            <img src={upload.img.cdnUrl} alt="" />
                            <div className="card__content">
                                <img src={profilePictures[upload.username]} id='uploader-pfp' alt="Profile" />
                                <p className="card__title">Feltöltő: {upload.username}</p>
                                <div className="uploader-desc">
                                    <p className="card__description">{upload.desc}</p>
                                </div>
                                <a onClick={() => viewImage(upload.id)}>Megnézem</a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Main;
