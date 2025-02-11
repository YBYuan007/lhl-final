import { useState, useEffect, useRef } from 'react';
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import './Booking.scss';







export default function Booking(props) {

  const [user,setUser] = useState({});
  const [booking, setBooking] = useState([])
  const [bookingList, setBookingList] = useState([])
  const [date, setDate] = useState()
  let navigate = useNavigate();


  const getFormattedDate = (date) => {

    const newDate = new Date(date);

    var year = newDate.getFullYear();
  
    var month = (1 + newDate.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;
  
    var day = newDate.getDate().toString();
    day = day.length > 1 ? day : '0' + day;
    
    return month + '/' + day + '/' + year;

  }

  useEffect(()=>{ 
    const storedUser = localStorage.getItem('storedUser');
    if (!storedUser) {
      window.location.href = "/login";
    }; 
    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);
    }, [])

  const convertToArray = (obj) => {
    let newArray = [];
    for(let o in obj){
      console.log(obj[o]);
      newArray.push(obj[o]);
    }
    setBookingList(newArray);
  } 

  useEffect(() => {
    axios.get("http://localhost:3005/api/booking")
    .then((result) => {
      console.log("hereeeeee is the get result:", result.data)
      setBooking(result.data)
      convertToArray(result.data);
      
    })
  }, [])

  const createBooking = (data) => {
    console.log("see see", data);
     axios.post("http://localhost:3005/api/booking", {
          student_id: data.student_id, 
          test_id: data.test_id,
          start_date: data.start_date
    })
    .then((result) => {
      console.log("post result isss:", result)
      navigate(`/dashboard`);
    })
    .catch((e)=>{
      console.log(e)
    })
  }

   return (
    <div className="booking-container">
      <div>
        <label className="booking-label">
          Please choose a date
        </label>
        <DatePicker selected={date} minDate={new Date()} onChange={(d) => setDate(d)} className="booking-datepicker" /> 
      </div>
      <div className="booking-list">
        <label className="booking-label">Exam Type</label>
        { bookingList.map((booking) => {
        return (             
        <div className="booking-list-item">
          <div>{booking.type}</div>
          <button className="booking-button"
                        onClick={() => {
              console.log("hellooooo")
             createBooking({
              student_id: user.id,
              test_id: booking.id,
              start_date: date
            })}}>Book</button>
        </div>
         )
        })} 
      </div>
    </div>
  );
}