import {
  GET_SUGGESTION_CATEGORIES_ERROR,
  GET_SUGGESTION_CATEGORIES_SUCCESS,
} from "../actions/actionTypes";

const initialState = {
  suggestionCategories: [],
  error: null,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_SUGGESTION_CATEGORIES_SUCCESS:
      return {
        ...state,
        suggestionCategories: action.payload,
      };

    case GET_SUGGESTION_CATEGORIES_ERROR:
      return {
        ...state,
        error: action.error,
      };

    default:
      return state;
  }
}
