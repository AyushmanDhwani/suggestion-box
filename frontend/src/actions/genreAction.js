import {
  GET_GENRES_ERROR,
  GET_GENRES_SUCCESS,
  ADD_GENRE_SUCCESS,
  ADD_GENRE_ERROR,
  GET_SUGGESTION_CATEGORIES_ERROR,
  GET_SUGGESTION_CATEGORIES_SUCCESS,
} from "./actionTypes";
// import Axios from "axios";
import Axios from "../api/axiosConfig";


export const getGenres = () => {
  return async (dispatch) => {
    try {
      const result = await Axios.get("/api/genres");
      dispatch({ type: GET_GENRES_SUCCESS, payload: result.data });
    } catch (error) {
      dispatch({ type: GET_GENRES_ERROR, error });
    }
  };
};

export const addGenre = (genre) => {
  return async (dispatch) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user ? user.accessToken : null;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const result = await Axios.post("/api/suggestionCategories", genre, config);
      dispatch({ type: ADD_GENRE_SUCCESS, payload: result.data });
    } catch (error) {
      dispatch({ type: ADD_GENRE_ERROR, error });
    }
  };
};

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
