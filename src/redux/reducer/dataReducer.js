import {GET_DATA} from "../action/dataAction";


const initialState = {
  data:[],


}

export const  dataReducer = (state=initialState,action)=>{
  switch (action.type) {
    case GET_DATA:
      return{
        ...state,
        data: action.payload
      }

    default:
      return state
  }
}
