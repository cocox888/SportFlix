export const initialState = {
  userData: null,
  allignMap: false,
  loggedIn: false,
  loading: false,
  responseData: null,
  eventList: [],
};

const moveMapToLocation = (id, eventList, focusMapToLocation) => {
  if (id) {
    const targetEvent = eventList.filter((event) => event._id === id);
    const targetCoordinates = [
      targetEvent[0].latitude,
      targetEvent[0].longitude,
    ];
    // console.log(targetCoordinates);
    focusMapToLocation(targetCoordinates);
  }
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
    case "SET_LOCATION_SEARCH":
      return {
        ...state,
        locationSearchRef: action.locationSearchRef,
      };
    case "SET_EVENT_LIST":
      return {
        ...state,
        eventList: action.eventList,
      };
    case "SET_FOCUS_MAP_TO_LOCATION_FUNCTION":
      return {
        ...state,
        focusMapToLocation: action.focusMapToLocation,
      };
    case "FLY_TO_LOCATION":
      moveMapToLocation(
        action.id,
        state?.eventList?.allEvents,
        state?.focusMapToLocation
      );

    default:
      return state;
  }
};

export default reducer;
