export const initialState = {
  userData: null,
  allignMap: false,
  loggedIn: false,
  loading: false,
  responseData: null,
};
const reducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return {
        ...state,
        loading: action.loading,
      };
    case "SET_LOGIN_STATUS":
      return {
        ...state,
        loggedIn: action.loggedIn,
      };
    case "SET_USER_DATA":
      return {
        ...state,
        userData: action.userData,
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
    case "SET_RESPONSE_DATA":
      return {
        ...state,
        responseData: action.responseData,
      };
    default:
      return state;
  }
};

export default reducer;
