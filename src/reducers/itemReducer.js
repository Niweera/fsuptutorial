import {
  UPLOADING_START,
  UPLOADING_SUCCESS,
  UPLOADING_FAIL,
  UPLOADING,
  GET_DATA
} from "../actions/types";

const initialState = {
  error: null,
  percent: null,
  showProgress: false,
  image: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case UPLOADING_START:
      return {
        ...state,
        percent: 0,
        showProgress: true
      };
    case UPLOADING_SUCCESS:
      return {
        ...state,
        error: false,
        percent: null,
        showProgress: false
      };
    case UPLOADING_FAIL:
      return {
        ...state,
        error: action.payload,
        showProgress: false
      };
    case UPLOADING:
      return {
        ...state,
        percent: action.payload,
        showProgress: true
      };

    case GET_DATA:
      return {
        ...state,
        image: action.payload
      };
    default:
      return state;
  }
}
