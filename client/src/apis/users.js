import axios from 'axios';

let API_END_POINT = './users'
if(process.env.NODE_ENV === 'development')
    API_END_POINT = "http://localhost:5000/users"

export default axios.create({
    baseURL: API_END_POINT
})