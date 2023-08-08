import axios from "axios";
import { toast } from 'react-toastify';

export const GET_DATA = "GET_DATA";
export const ADD_DATA = "ADD_DATA";
export const DELETE_DATA = "DELETE_DATA";

export const getDataThunk = () => async (dispatch) => {
  try {
    const response = await axios.get("http://localhost:5000/longTree")
    dispatch({
      type: GET_DATA,
      payload: [response.data]

    })
    console.log("response:", response)
  } catch (e) {
    console.log("error")
  }
}

export const addDataThunk = (data, action) => async (dispatch) => {
  try {
    const response = await axios.put("http://localhost:5000/longTree", data);
    toast(`Menu item ${action} successfully!`, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      type: "success"
    });
    console.log("response:", response)
  } catch (e) {
    console.log("error")
  }
}
export const deleteDataTHunk = (data) => async (dispatch) => {
  try {
    const response = await axios.put("http://localhost:5000/longTree", data);
    toast('Menu item deleted!', {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      type: 'error'
    });
  } catch (e) {
    console.log("error")
  }
}