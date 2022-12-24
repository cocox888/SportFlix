export const initialState = {
  user: null,
  allignMap: false,
  loggedIn: false
};
const reducer = (state, action) => {
  switch (action.type) {
    case "SET_LOGIN_STATUS":
      return {
        ...state,
        loggedIn: action.loggedIn,
      };
    case "SET_FOCUS_MAP_TO_CENTER":
      return {
        ...state,
        focusMapToCenter: action.focusMapToCenter,
      }; 
    case "SET_EVENT_SELECTED":
      return {
        ...state,
        selectedEvent: action.selectedEvent,
      };
    default:
      return state;
  }
};

export default reducer;
