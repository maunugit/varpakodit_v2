import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import styled from 'styled-components';
import Sidebar from './Sidebar';
import axios from 'axios';

// Styled components
const ProfileContainer = styled.div`
  display: flex;
  height: 100vh;
  background-color: #f0f2f5;
  font-family: 'Arial', sans-serif;
`;

const ProfileContent = styled.div`
  margin-left: 250px; /* Adjust for sidebar width */
  background-color: #ffffff;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 350px; /* Set fixed width */
  margin: auto; /* Center the container */
`;

const ProfileImage = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  margin-bottom: 20px;
  cursor: pointer; /* Indicate that the image can be clicked to change */
  object-fit: cover;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-size: 16px;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-size: 16px;
  resize: none; /* Prevent resizing */
`;

const SaveButton = styled.button`
  background-color: #6200ee;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 10px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #3700b3;
  }
`;

const Profile = () => {
  const { user, isAuthenticated  } = useAuth0();
  const [profileData, setProfileData] = useState({
    age: '',
    grade: '',
    weight: '',
    bloodType: '',
    height: '',
    hobbies: '',
    favoriteSubject: '',
    phoneNumber: '',
    bio: '',
    image: null,
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      if (isAuthenticated && user) {
        try {
          const response = await axios.get(`http://localhost:5000/api/profile/${user.sub}`);
          if (response.data) {
            setProfileData(prevData => ({
              ...prevData,
              ...response.data,
              image: response.data.image || user.picture
            }));
          }
        } catch (error) {
          console.error('Error fetching profile data:', error);
        }
      }
    };

    fetchProfileData();
  }, [isAuthenticated, user]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setProfileData(prevData => ({
        ...prevData,
        image: reader.result
      }));
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Sending profile data:', { userId: user.sub, ...profileData });
      const response = await axios.post('http://localhost:5000/api/profile', {
        userId: user.sub,
        ...profileData,
      });
      console.log('Server response:', response.data);
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      if (error.response) {
        console.error('Error data:', error.response.data);
        console.error('Error status:', error.response.status);
        console.error('Error headers:', error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Error request:', error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error message:', error.message);
      }
      alert('Failed to update profile');
    }
  };  

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    // <form onSubmit={handleSubmit}>
      <ProfileContainer>
        <Sidebar />
        <ProfileContent>
          <label htmlFor="profile-image-upload">
            <ProfileImage src={profileData.image || user.picture} alt={profileData.name} />
          </label>
          <input
            id="profile-image-upload"
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleImageChange}
          />
          <Input
            type="number"
            name="age"
            placeholder="Age"
            value={profileData.age}
            onChange={handleInputChange}
          />
          <Input
            type="number"
            name="grade"
            placeholder="Grade"
            value={profileData.grade}
            onChange={handleInputChange}
          />
          <Input
            type="number"
            name="weight"
            placeholder="Weight (kg)"
            value={profileData.weight}
            onChange={handleInputChange}
          />
          <Input
            type="text"
            name="bloodType"
            placeholder="Blood Type"
            value={profileData.bloodType}
            onChange={handleInputChange}
          />
          <Input
            type="number"
            name="height"
            placeholder="Height (cm)"
            value={profileData.height}
            onChange={handleInputChange}
          />
          <Input
            type="text"
            name="hobbies"
            placeholder="Hobbies"
            value={profileData.hobbies}
            onChange={handleInputChange}
          />
          <Input
            type="text"
            name="favoriteSubject"
            placeholder="Favorite Subject"
            value={profileData.favoriteSubject}
            onChange={handleInputChange}
          />
           <Input
            type="tel"
            name="phoneNumber"
            placeholder="Phone Number"
            value={profileData.phoneNumber}
            onChange={handleInputChange}
          />
          <TextArea
            name="bio"
            placeholder="Short Bio"
            value={profileData.bio}
            onChange={handleInputChange}
          />
          <SaveButton onClick={handleSubmit}>Save Changes</SaveButton>
          {/* <SaveButton>Save Changes</SaveButton> */}
        </ProfileContent>
      </ProfileContainer>
      // </form>
    
  );
};

export default Profile;
