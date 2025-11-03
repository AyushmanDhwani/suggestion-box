import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { connect } from "react-redux";
import { getSuggestions } from "../../actions/moviesAction";
import { Loading } from "../../components/common";

const SuggestionDetail = ({ suggestions, loading, getSuggestions }) => {
  const { id } = useParams();
  const [suggestion, setSuggestion] = useState(null);

  useEffect(() => {
    if (!suggestions?.length) getSuggestions();
  }, [suggestions, getSuggestions]);

  useEffect(() => {
    const found = suggestions.find((s) => String(s._id) === id);
    setSuggestion(found);
  }, [suggestions, id]);

  if (loading || !suggestion)
    return (
      <div className="background-container pt-5">
        <Loading />
      </div>
    );

  return (
    <div className="container py-5 text-white">
      <Link to="/suggestions" className="btn btn-outline-light mb-4">
        ← Back
      </Link>
      <h2 className="mb-3">{suggestion.title}</h2>
      <p className="text-muted">
        Category: {suggestion.suggestionCategory?.name || "N/A"}
      </p>
      <p>{suggestion.description || "No description available."}</p>

      {/* Add more fields as needed */}
      <ul>
        <li>Rating: {suggestion.rating || "N/A"}</li>
        <li>Release Date: {suggestion.releaseDate || "N/A"}</li>
      </ul>
    </div>
  );
};

const mapStateToProps = (state) => ({
  suggestions: state.movie.suggestions,
  loading: state.movie.loading,
});

export default connect(mapStateToProps, { getSuggestions })(SuggestionDetail);
