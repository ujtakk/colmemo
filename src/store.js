import { createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import * as type from './actions';

const initialState = {
  signedIn: false,
  openSidebar: false,
  focusedItem: '',
  attrs: [
    {key: 'title', type: 'string', label: 'タイトル', width: 300, flexGrow: 1},
  ],
  items: [],
  notes: {},
};

function rootReducer(state=initialState, action) {
  switch (action.type) {
    case type.SIGN_IN:
      return Object.assign({}, state, {
        signedIn: true,
      });
    case type.SIGN_OUT:
      return Object.assign({}, state, {
        signedIn: false,
      });
    case type.ADD_ITEM:
      return Object.assign({}, state, {
        items: [...state.items, {title: action.value}]
      });
    case type.ADD_ATTR:
      if (action.attr_type === '') {
        return state;
      }
      return Object.assign({}, state, {
        attrs: [...state.attrs, action.value]
      });
    case type.FOCUS_ITEM:
      return Object.assign({}, state, {
        focusedItem: action.value,
      });
    case type.UPDATE_NOTE:
      if (state.focusedItem === '') {
        return state;
      } else {
        return Object.assign({}, state, {
          notes: {...state.notes, [state.focusedItem]: action.value},
        });
      }
    case type.TOGGLE_SIDEBAR:
      return Object.assign({}, state, {
        openSidebar: !state.openSidebar,
      });
    case type.RESET_STORE:
      if ('value' in action) {
        return Object.assign({}, state, action.value);
      }
      return initialState;
    default:
      return state;
  }
}

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['attrs', 'items', 'notes'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(persistedReducer);

export const persistor = persistStore(store);
export default store;
