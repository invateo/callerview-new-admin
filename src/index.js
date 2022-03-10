import React from 'react';
import ReactDOM from 'react-dom';
import './app.css';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "react-modal";
import { Loader } from './utility/loader';
import { Provider } from "react-redux";
import store from "./store";

Modal.setAppElement("#root");

toast.configure({
  draggable: false,
  autoClose: 3000,
});

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <Loader />
      <App />
    </React.StrictMode>
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
