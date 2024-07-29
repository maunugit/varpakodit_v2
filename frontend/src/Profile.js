import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import styled from 'styled-components';
import Sidebar from './Sidebar';

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
  const { user, isAuthenticated } = useAuth0();
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [bloodType, setBloodType] = useState('');
  const [height, setHeight] = useState('');
  const [hobbies, setHobbies] = useState('');
  const [favoriteSubject, setFavoriteSubject] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState(user.picture);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setProfileImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    // Logic to save the updated profile data
    console.log('Profile updated:', { 
      age, 
      weight, 
      bloodType, 
      height, 
      hobbies, 
      favoriteSubject, 
      phoneNumber, 
      bio, 
      profileImage 
    });
  };

  return (
    isAuthenticated && (
      <ProfileContainer>
        <Sidebar />
        <ProfileContent>
          <label htmlFor="profile-image-upload">
            <ProfileImage src={profileImage} alt={user.name} />
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
            placeholder="Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Weight (kg)"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Blood Type"
            value={bloodType}
            onChange={(e) => setBloodType(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Height (cm)"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Hobbies"
            value={hobbies}
            onChange={(e) => setHobbies(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Favorite Subject"
            value={favoriteSubject}
            onChange={(e) => setFavoriteSubject(e.target.value)}
          />
          <Input
            type="tel"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <TextArea
            placeholder="Short Bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
          <SaveButton onClick={handleSave}>Save Changes</SaveButton>
        </ProfileContent>
      </ProfileContainer>
    )
  );
};

export default Profile;
