// import Axios from "axios";
import Axios from "../api/axiosConfig";

import {
  GET_MOVIES_SUCCESS,
  GET_MOVIES_ERROR,
  GET_SUGGESTIONS_SUCCESS,
  GET_SUGGESTIONS_ERROR,
} from "./actionTypes";

export const getMovies = () => {
  return async (dispatch) => {
    try {
      const result = await Axios.get("/api/movies");
      dispatch({ type: GET_MOVIES_SUCCESS, payload: result.data.movies });
    } catch (error) {
      dispatch({ type: GET_MOVIES_ERROR, error });
    }
  };
};

export const addMovie = (movie, history) => {
  return async (dispatch) => {
    console.log("Adding movie:", movie);
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user ? user.accessToken : null;
    const contentType = {
      headers: {
        "content-type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };
    let formData = new FormData();
    formData.append("title", movie.title);
    formData.append("genre", movie.genre);
    formData.append("rate", movie.rate);
    formData.append("description", movie.description);
    formData.append("image", movie.image);
    formData.append("trailerLink", movie.trailerLink);
    formData.append("movieLength", movie.movieLength);

    try {
      console.log("Sending POST request to /api/movies/addMovie with data:", formData);
      const result = await Axios.post(
        "/api/movies/addMovie",
        formData,
        contentType
      );
      console.log("Received response from server:", result);
      dispatch({ type: GET_MOVIES_SUCCESS, payload: result.data.movies });
      history.push("/movies");
      const updatedMovies = await Axios.get("/api/movies");
      dispatch({
        type: GET_MOVIES_SUCCESS,
        payload: updatedMovies.data.movies,
      });
    } catch (error) {
      console.error("Error sending request:", error);
      dispatch({ type: GET_MOVIES_ERROR, error });
    }
  };
};

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

export const addSuggestion = (formData, history) => {
  return async (dispatch) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user ? user.accessToken : null;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        // Do NOT set 'Content-Type' here!
      },
    };
    try {
      const result = await Axios.post("/api/suggestions", formData, config);
      if (history) history.push("/suggestions");
    } catch (error) {
      // handle error
    }
  };
};
