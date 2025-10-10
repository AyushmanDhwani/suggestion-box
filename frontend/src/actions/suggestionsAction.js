import Axios from "axios";
import { GET_SUGGESTIONS_SUCCESS, GET_SUGGESTIONS_ERROR } from "./actionTypes";

export const getSuggestions = () => {
  return async (dispatch) => {
    try {
      const result = await Axios.get("/api/suggestions");
      dispatch({ type: GET_SUGGESTIONS_SUCCESS, payload: result.data.suggestions });
    } catch (error) {
      dispatch({ type: GET_SUGGESTIONS_ERROR, error });
    }
  };
};

export const addSuggestion = (suggestion, history) => {
  return async (dispatch) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user ? user.accessToken : null;
    const config = {
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const result = await Axios.post("/api/suggestions/addSuggestion", suggestion, config);
      dispatch({ type: GET_SUGGESTIONS_SUCCESS, payload: result.data.suggestions });
      history.push("/suggestions");
    } catch (error) {
      dispatch({ type: GET_SUGGESTIONS_ERROR, error });
    }
  };
};
