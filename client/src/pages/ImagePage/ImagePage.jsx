import React, { Fragment, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ImagePage = () => {
    const { imageId } = useParams();
    const [imageDetails, setImageDetails] = useState(null);
    const [comment, setComment] = useState(null);
    const [comments, setComments] = useState([]);
    const [profilePictures, setProfilePictures] = useState({});
    const userData = JSON.parse(localStorage.getItem('userData'));
    
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
    
    useEffect(() => {
        const fetchImage = async () => {
            try {
                const response = await axios.get(`http://localhost:3500/getImageData/${imageId}`);
                setImageDetails(response.data);
                console.log(response);
            } catch (error) {
                console.error('Error fetching image data:', error);
            }
        };

        const fetchComments = async () =>{
            try {
                const response = await axios.get(`http://localhost:3500/getComments/${imageId}`);
                setComments(response.data);
                console.log(comments);
            } catch (error) {
                console.error('An error occurred while fetching user uploads:', error);
            }
        }

        fetchComments();
        fetchImage();
    }, [imageId]);

    useEffect(() => {
        const fetchProfilePictures = async () => {
            const profilePicturesMap = {};
            for (const comment of comments) {
                const pfp = await getUserData(comment.username);
                profilePicturesMap[comment.username] = pfp;
            }
            setProfilePictures(profilePicturesMap);
        };

        fetchProfilePictures();
    }, [comments]);

    async function handleSubmit(e) {
        e.preventDefault();
        try {
          const response = await axios.post("http://localhost:3500/comment", {
            username: userData.username,
            comment: comment,
            imgId: imageId,
           
          });
            alert("Sikeres feltöltés");
            window.location.reload(false)
          
        } catch (error) {
          console.error(error);
          alert("Hiba történt a feltöltés során");
        }
      }

    if (!imageDetails) {
        return <p>A keresett kép nem található!</p>;
    }

    const deleteCommentHandler = async (commentId) => {
        let confirmDelete = window.confirm("Biztosan törölni szeretnéd a Kommented?")
        if (confirmDelete){
          try {
              const response = await axios.delete(`http://localhost:3500/deleteComment/${commentId}`);
              window.location.reload(false)
              
          } catch (error) {
              console.error("Error while deleting comment:", error);
          }
        }
    };


    return (
        <div className='image-page-container'>
            <div className='image-details'>
                {imageDetails.img && imageDetails.img.cdnUrl && (
                <Fragment>
                    <img src={imageDetails.img.cdnUrl} alt="Uploaded" />
                    <h1>Cím: {imageDetails.img.name}</h1>
                    <h2>Feltöltő: {imageDetails.username}</h2>
                    <p>Leírás: {imageDetails.desc}</p>
                    <form onSubmit={handleSubmit} className='comment-form'>
                        <textarea  onChange={(e) => setComment(e.target.value)} id="Comment" placeholder='írj megjegyzést..' />
                        <button onClick={handleSubmit}>Küldés</button>
                    </form>
                    <div className='comments-container'>
                        {comments.map((singleComment) => (
                            <div key={singleComment._id} className='comment'>
                                <img src={profilePictures[singleComment.username]} alt="user pfp" id='comment-user-pfp' />
                                <h3>{singleComment.username}:</h3>
                                <p>{singleComment.comment}</p>
                                {userData.username == singleComment.username ? (
                                    <div className='comment-buttons'> 
                                        <button onClick={() => {deleteCommentHandler(singleComment._id)}} ><img src="/img/trash-can.png" alt="" /></button>
                                    </div>
                                ) : (
                                    null
                                )}
                            </div>
                        ))}
                    </div>
                </Fragment>
                )}
            </div>
        </div>
    );
};

export default ImagePage;