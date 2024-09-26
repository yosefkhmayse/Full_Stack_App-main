import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const AddBook = () => {
  const navigate = useNavigate();
  const [book, setBook] = useState({
    title: '',
    author: '',
    available: true,
    year: '',
    genre: '',
    description: '',
    image: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBook((prevBook) => ({ ...prevBook, [name]: value }));
  };

  const handleImageChange = (e) => {
    setBook((prevBook) => ({ ...prevBook, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    const formData = new FormData();
    formData.append('title', book.title);
    formData.append('author', book.author);
    formData.append('available', book.available);
    formData.append('year', book.year);
    formData.append('genre', book.genre);
    formData.append('description', book.description);
    if (book.image) {
      formData.append('image', book.image);
    }
  
    try {
      const response = await axios.post('/books/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Response data:', response.data);
      setBook({
        title: '',
        author: '',
        available: true,
        year: '',
        genre: '',
        description: '',
        image: null
      });
      navigate('/books');
    } catch (error) {
      console.error('Error details:', error.response || error.message || error);
      setError('שגיאה בהוספת הספר. אנא נסה שוב.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Heading>📚 הוסף ספר חדש</Heading>
      <Form onSubmit={handleSubmit}>
        <Label>כותרת:</Label>
        <Input
          type="text"
          name="title"
          value={book.title}
          onChange={handleInputChange}
          required
        />
        <Label>מחבר:</Label>
        <Input
          type="text"
          name="author"
          value={book.author}
          onChange={handleInputChange}
          required
        />
        <Label>שנת פרסום:</Label>
        <Input
          type="number"
          name="year"
          value={book.year}
          onChange={handleInputChange}
          required
        />
        <Label>סוגה:</Label>
        <Input
          type="text"
          name="genre"
          value={book.genre}
          onChange={handleInputChange}
          required
        />
        <Label>תיאור:</Label>
        <Textarea
          name="description"
          value={book.description}
          onChange={handleInputChange}
        />
        <Label>
          זמין:
          <Checkbox
            type="checkbox"
            name="available"
            checked={book.available}
            onChange={() => setBook((prevBook) => ({ ...prevBook, available: !prevBook.available }))}
          />
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
        <SubmitButton type="submit" disabled={loading}>
          {loading ? 'אנא המתן...' : 'הוסף ספר 📖'}
        </SubmitButton>
        {error && <Error>{error}</Error>}
      </Form>
    </Container>
  );
};

export default AddBook;

// Styled Components
const Container = styled.div`
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const Heading = styled.h2`
  text-align: center;
  margin-bottom: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Label = styled.label`
  font-weight: bold;
`;

const Input = styled.input`
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
  width: 100%;
`;

const Textarea = styled.textarea`
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
  width: 100%;
  height: 100px;
`;

const Checkbox = styled.input`
  margin-left: 10px;
`;

const FileLabel = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #007bff;
  font-size: 0.9em;
`;

const FileInput = styled.input`
  display: none;
`;

const UploadIcon = styled.span`
  margin-right: 8px;
  font-size: 2em;
`;

const SubmitButton = styled.button`
  padding: 10px 15px;
  background-color: #00aaff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  margin-top: 15px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #007bb5;
  }
`;

const Error = styled.p`
  color: red;
  text-align: center;
`;
