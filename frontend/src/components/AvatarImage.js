import React, { useState } from 'react';
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import Avatar from 'react-avatar-edit';
import './styles/AvatarImage.css';
import axios from 'axios';
import { API_GATEWAY_URL_API } from '../config/constant';

export default function AvatarImage({ avatarUrl, email }) {
    const [dialogs, setDialogs] = useState(false);
    const [imgCrop, setImgCrop] = useState(null);
    const [storeImage, setStoreImage] = useState(avatarUrl); 
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(''); 

    const onCrop = (view) => {
        setImgCrop(view);
    };

    const onClose = () => {
        setImgCrop(null);
    };

    const closeDialog = () => {
        setDialogs(false);
        setImgCrop(null);
        setError('');
        setUploading(false);
    };

    const saveImage = async () => {
        if (imgCrop) {
            setUploading(true);
            try {
                // Send the base64 image to Firestore via your backend
                await axios.post(`${API_GATEWAY_URL_API}/user/profile/updateavatar`, {
                    email: email, 
                    image: imgCrop
                });
    
                setStoreImage(imgCrop); 
                setDialogs(false); 
                
            } catch (error) {
                if (error.response && error.response.status === 413) {
                    setError("The image is too large. Please make it smaller.")
                } else {
                    console.error("Error saving image:", error);
                    setError("An error occurred while uploading the image.");
                }
            } finally {
                setUploading(false);
            }
        }
    };

    return (
        <div className='profile-img-container'>
            <div className='avatar-wrapper'>
                <img 
                    className="profile-avatar"
                    src={storeImage || `${process.env.PUBLIC_URL}/human_icon.jpg`}
                    alt="Profile Icon"
                    onClick={() => setDialogs(true)}
                />
                <Dialog
                    visible={dialogs}
                    onHide={closeDialog}
                    className="custom-dialog"
                    closable={false}  
                >
                    <div className="dialog-content">
                        <button 
                            onClick={closeDialog}
                            className="dialog-close-button"
                        >
                            &times;
                        </button>
                        
                        <div className='confirmation-content'>
                            <div className='avatar-edit-container'>
                                <Avatar
                                    width={390}
                                    height={295}
                                    onCrop={onCrop}
                                    onClose={onClose}
                                />
                                {error && <p className="error-message">{error}</p>}
                                <Button onClick={saveImage} label={uploading ? 'Uploading...' : 'Save'} icon="pi pi-check" className="save-button" disabled={uploading} />
                            </div>
                        </div>
                    </div>
                </Dialog>
            </div>
        </div>
    );
};
