import React, { Component, useEffect } from "react";
import {
  Route,
  Redirect,
  Switch,
  BrowserRouter as Router,
} from "react-router-dom";

import Movies from "./pages/Movies";
import AddMovieForm from "./pages/AddMovie";
import AddGenre from "./pages/AddGenre";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Suggestions from "./pages/Suggestions";
import SuggestionDetail from "./pages/SuggestionDetail";


import "./App.css";

import { Provider } from "react-redux";
import store from "./store";

import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

// Optional functional wrapper to handle toast on page load
const ToastHandler = () => {
  useEffect(() => {
    const msg = localStorage.getItem("toastMessage");
    console.log("Toast message on load:", msg);
    debugger;
    if (msg) {
      toast.warn(msg, { autoClose: 5000 });
      localStorage.removeItem("toastMessage");
    }
  }, []);
  return null;
};
class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Navbar />
            {/* Toast container */}
            <ToastContainer 
              position="top-right" 
              autoClose={5000} 
              hideProgressBar={false} 
              newestOnTop={false} 
              closeOnClick 
              rtl={false} 
              pauseOnFocusLoss 
              draggable 
              pauseOnHover
            />

             {/* Render toast handler */}
            <ToastHandler />
            <Switch>
              <Route exact path="/movies/new" component={AddMovieForm} />
              <Route exact path="/genres/new" component={AddGenre} />
              <Route exact path="/login" component={Login} />
              <Route path="/register" component={Register} />
              <Route path="/movies" exact component={Movies} />
              <Route path="/suggestions" exact component={Suggestions} />
              <Route path="/suggestions/:id" component={SuggestionDetail} />

              <Redirect exact from="/" to="/login" />
            </Switch>
            <Footer />
          </div>
        </Router>
      </Provider>
    );
  }
}



export default App;
