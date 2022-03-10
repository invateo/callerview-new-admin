import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import reducer from '../store/reducers';

const middleWare = [thunk];

const store = createStore(
  reducer,
  compose(applyMiddleware(...middleWare))
);
// const store = createStore(
//   reducer,
//   compose(applyMiddleware(...middleWare))
// )

export default store;