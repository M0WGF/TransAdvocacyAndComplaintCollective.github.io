import React, { useState, useEffect } from "react";
import BodyPage from 'partials/BodyPage';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import ReCAPTCHA from 'react-google-recaptcha';
import ReactDOM from "react-dom/client"; // Properly import ReactDOM

const Email = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const recaptchaSiteKey = "6Lfbl5MqAAAAAMRoIv_3h86GFZqQJCbu_c2SzOIH"; // Replace with your actual site key

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRecaptcha = (token) => {
    setRecaptchaToken(token);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!recaptchaToken) {
      alert('Please complete the reCAPTCHA');
      return;
    }

    setIsSubmitting(true);

    const payload = { ...formData, recaptchaToken };

    try {
      const response = await fetch('http://localhost:3055/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (result.success) {
        alert('Message sent successfully!');
        setFormData({ name: '', email: '', message: '' });
        setRecaptchaToken(null);
      } else {
        alert(result.message || 'An error occurred');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred while sending the message');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BodyPage
      title="Email"
      description="Learn more about the Trans Advocacy and Complaint Collective UK"
    >
      <Container className="mt-5">
        <h1>Contact Form</h1>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="name">
            <Form.Label htmlFor="name">Name:</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your name"
            />
          </Form.Group>

          <Form.Group controlId="email" className="mt-3">
            <Form.Label htmlFor="email">Email:</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </Form.Group>

          <Form.Group controlId="message" className="mt-3">
            <Form.Label htmlFor="message">Message:</Form.Label>
            <Form.Control
              as="textarea"
              name="message"
              rows={5}
              value={formData.message}
              onChange={handleChange}
              required
              placeholder="Enter your message"
            />
          </Form.Group>

          <div className="mt-3">
            <ReCAPTCHA
              sitekey={recaptchaSiteKey}
              onChange={handleRecaptcha}
            />
          </div>

          <Button
            variant="primary"
            type="submit"
            className="mt-3"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </Form>
      </Container>
    </BodyPage>
  );
};

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container); 
root.render(<Email />);
export default Email;

