import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { login } from '../store/authSlice'
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from './ui'
import { useLocation } from 'react-router-dom';
const { verifyOTP } = require('../api/user')


export default function OTPVerification() {
  const [otp, setOtp] = useState('')
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation();


  const handleSubmit = async(e) => {
    e.preventDefault()
    const phone = location.state?.phone;
    console.log('phone in otp verification: ',phone)
    const resp = await verifyOTP(phone, otp);
    console.log('verifyOTP response:', resp);
    const { token,  user } = resp;
    console.log('token:', token);
    console.log('user:', user);
    dispatch(login({ token: token, user: user }));
    navigate('/')
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Enter OTP</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="w-full"
            />
            <Button type="submit" className="w-full">
              Verify OTP
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}