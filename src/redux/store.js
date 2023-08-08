
import rootReducer from "./reducer/rootReducer";
import thunk from "redux-thunk";
import {applyMiddleware, createStore} from "redux";

const store = createStore(rootReducer,applyMiddleware(thunk))

export default store