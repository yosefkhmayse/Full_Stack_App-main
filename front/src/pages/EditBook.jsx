import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const EditBook = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [newImage, setNewImage] = useState(null); // State for new image
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch book details by ID
    axios.get(`/books/${id}`)
      .then(response => setBook(response.data))
      .catch(error => console.error('שגיאה בטעינת פרטי הספר 🛑:', error));
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBook(prevBook => ({
      ...prevBook,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    setNewImage(e.target.files[0]); // Update new image state
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', book.title);
    formData.append('author', book.author);
    formData.append('available', book.available);
    formData.append('year', book.year);
    formData.append('genre', book.genre);
    formData.append('rating', book.rating);
    formData.append('description', book.description);

    if (newImage) {
      formData.append('image', newImage); // Append new image if available
    }

    try {
      await axios.put(`/books/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      navigate('/books');
    } catch (error) {
      console.error('שגיאה בעדכון הספר 🛑:', error);
    }
  };

  if (!book) return <div>🔄 טוען...</div>;

  return (
    <PageContainer>
      <ContentBox>
        <Header>ערוך ספר 📚</Header>
        <Form onSubmit={handleSubmit}>
          <Label>
            שם הספר:
            <Input
              type="text"
              name="title"
              value={book.title}
              onChange={handleChange}
              required
            />
          </Label>
          <Label>
            מחבר:
            <Input
              type="text"
              name="author"
              value={book.author}
              onChange={handleChange}
              required
            />
          </Label>
          <Label>
            זמין:
            <Checkbox
              type="checkbox"
              name="available"
              checked={book.available}
              onChange={handleChange}
            />
          </Label>
          <Label>
            שנת פרסום:
            <Input
              type="text"
              name="year"
              value={book.year}
              onChange={handleChange}
            />
          </Label>
          <Label>
            ז'אנר:
            <Input
              type="text"
              name="genre"
              value={book.genre}
              onChange={handleChange}
            />
          </Label>
          <Label>
            דירוג:
            <Input
              type="number"
              name="rating"
              value={book.rating}
              onChange={handleChange}
            />
          </Label>
          <Label>
            תיאור:
            <Textarea
              name="description"
              value={book.description}
              onChange={handleChange}
            />
          </Label>
          <Label>
            תמונה נוכחית:
            {book.image && <Image src={book.image} alt={book.title} />}
          </Label>
          <Label>
            <FileLabel>
              <UploadIcon>📁</UploadIcon> בחר תמונה
              <FileInput
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </FileLabel>
          </Label>
          <SubmitButton type="submit">עדכן ספר 🔄</SubmitButton>
        </Form>
      </ContentBox>
    </PageContainer>
  );
};

export default EditBook;

// רכיבים מעוצבים
const PageContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f5f5f5;
`;

const ContentBox = styled.div`
    width: 100%;
    max-width: 400px; /* Reduced max-width */
    background-color: #fff;
    border-radius: 8px; /* Slightly smaller border-radius */
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
    padding: 20px; /* Reduced padding */
    text-align: center;
    margin-top: 20px; /* Reduced top margin */
`;

const Header = styled.h1`
    font-size: 1.5em; /* Reduced font size */
    color: #333;
    margin-bottom: 15px; /* Reduced bottom margin */
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 15px; /* Reduced gap */
`;

const Label = styled.label`
    display: flex;
    flex-direction: column;
    gap: 8px; /* Reduced gap */
    font-size: 0.9em; /* Slightly smaller font size */
    color: #555;
`;

const Input = styled.input`
    padding: 8px; /* Reduced padding */
    border: 1px solid #ccc;
    border-radius: 4px; /* Slightly smaller border-radius */
    font-size: 0.9em; /* Slightly smaller font size */
`;

const Checkbox = styled.input`
    margin-top: 3px; /* Reduced margin-top */
`;

const Textarea = styled.textarea`
    padding: 8px; /* Reduced padding */
    border: 1px solid #ccc;
    border-radius: 4px; /* Slightly smaller border-radius */
    min-height: 80px; /* Reduced min-height */
`;

const Image = styled.img`
    width: 200px; /* Reduced width */
    height: 120px; /* Reduced height */
    border-radius: 4px; /* Slightly smaller border-radius */
    margin-top: 8px; /* Reduced margin-top */
`;

const FileLabel = styled.label`
    display: flex;
    align-items: center;
    cursor: pointer;
    color: #007bff;
    font-size: 0.9em; /* Slightly smaller font size */
`;

const FileInput = styled.input`
    display: none; /* Hide the default file input */
`;

const UploadIcon = styled.span`
    margin-right: 8px; /* Space between icon and text */
    font-size: 2em; /* Larger font size for icon */
`;

const SubmitButton = styled.button`
    padding: 8px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 4px; /* Slightly smaller border-radius */
    cursor: pointer;
    font-size: 1em; /* Slightly smaller font size */
    margin-top: 15px; /* Reduced margin-top */
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #0056b3;
    }
`;
