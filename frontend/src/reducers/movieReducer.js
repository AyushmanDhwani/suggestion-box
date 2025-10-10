import { GET_SUGGESTIONS_SUCCESS, GET_SUGGESTIONS_ERROR } from "../actions/actionTypes";

const initialState = {
  suggestions: [],
  suggestion: {},
  error: null,
  loading: true,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_SUGGESTIONS_SUCCESS:
      return {
        ...state,
        suggestions: action.payload,
        loading: false,
      };

    case GET_SUGGESTIONS_ERROR:
      return {
        ...state,
        error: action.error,
      };

    default:
      return state;
  }
}
