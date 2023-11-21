import React, { useState } from 'react';
import axios from 'axios';
import { Widget } from "@uploadcare/react-widget";

const Upload = () => {
  const userData = JSON.parse(localStorage.getItem('userData'));
  const [uploadedFile, setUploadedFile] = useState(null); 
  const [desc, setDesc] = useState("");
  const [url, setUrl] = useState("");

  const handleUpload = (info) => {
    setUploadedFile(info);
    setUrl(info.cdnUrl)
    console.log(info);
  };

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3500/upload", {
        username: userData.username,
        desc,
        img: uploadedFile,
        id: uploadedFile.uuid
      });
        alert("Sikeres feltöltés");
        window.location.reload(false)
      
    } catch (error) {
      console.error(error);
      alert("Hiba történt a feltöltés során");
    }
  }

  return (
    <div className='upload-container'>
      <div className='preview-image'>
        <p>A kép előnézete</p>
        {url? (<img src={url}/>) : (null)} 
      </div>
      <div className="upload-form">
        <form onSubmit={handleSubmit}>
          <textarea
            type="text"
            id='desc'
            value={desc}
            placeholder='Leírás'
            onChange={(e) => setDesc(e.target.value)}
          />
          <p>
            <Widget
              clearable = 'true'
              publicKey='7d9167cc84c4a6e75384'
              id='file'
              onChange={handleUpload}
            />
          </p>
          <button type="submit" onClick={handleSubmit}>
            Feltöltés
          </button>
        </form>
      </div>
    </div>
  );
};

export default Upload;
