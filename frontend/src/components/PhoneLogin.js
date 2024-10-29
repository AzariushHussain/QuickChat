import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from './ui';
import { responseMessages } from '../utils/constants';
import formatMessage from '../utils/messageFormatter';
const { loginUser } = require('../api/user');

export default function PhoneLogin() {
  const [phone, setPhone] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedPhone = `+91${phone}`;

    loginUser({ phone: formattedPhone })
      .then((resp) => {
        navigate('/verify', { state: { phone: formattedPhone } });
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handlePhoneChange = (e) => {
    const { value } = e.target;

    // Allow only digits and restrict to 10 characters
    if (/^\d{0,10}$/.test(value)) {
      setPhone(value);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Enter your phone number</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="tel"
              placeholder="Phone number"
              value={phone}
              onChange={handlePhoneChange} // Use the new handler
              required
              className="w-full"
              maxLength="10" // Limit input to 10 digits
            />
            <Button type="submit" className="w-full" disabled={phone.length !== 10}>
              Send OTP
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
