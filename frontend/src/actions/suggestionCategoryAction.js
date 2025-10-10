import { GET_SUGGESTION_CATEGORIES_SUCCESS, GET_SUGGESTION_CATEGORIES_ERROR, ADD_SUGGESTION_CATEGORY_SUCCESS, ADD_SUGGESTION_CATEGORY_ERROR } from "./actionTypes";
import Axios from "axios";

export const getSuggestionCategories = () => {
  return async (dispatch) => {
    try {
      const result = await Axios.get("/api/suggestionCategories");
      dispatch({ type: GET_SUGGESTION_CATEGORIES_SUCCESS, payload: result.data });
    } catch (error) {
      dispatch({ type: GET_SUGGESTION_CATEGORIES_ERROR, error });
    }
  };
};

export const addSuggestionCategory = (category) => {
  return async (dispatch) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user ? user.accessToken : null;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const result = await Axios.post("/api/suggestionCategories", category, config);
      dispatch({ type: ADD_SUGGESTION_CATEGORY_SUCCESS, payload: result.data });
    } catch (error) {
      dispatch({ type: ADD_SUGGESTION_CATEGORY_ERROR, error });
    }
  };
};
