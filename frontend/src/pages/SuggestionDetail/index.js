import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { connect } from "react-redux";
import { getSuggestions } from "../../actions/moviesAction";
import { Loading } from "../../components/common";
import "./style.css";


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
    <div className="background-container py-5">
      <div className="mx-5">
        <Link to="/suggestions" className="suggestion-back-btn">
          ← Back to Suggestions
        </Link>

        <div className="suggestion-detail-card p-5">
          <h2 className="mb-3 text-primary">{suggestion.title}</h2>
          <p className="text-muted mb-4">
            Category: {suggestion.suggestionCategory?.name || "Uncategorized"}
          </p>

          <p className="lead mb-4">
            {suggestion.description || "No description available."}
          </p>

          <div className="mb-4">
            <p><strong>Status:</strong> {suggestion.status || "N/A"}</p>
            <p><strong>Created By:</strong> {suggestion.createdBy || "N/A"}</p>
            <p><strong>Date:</strong> {suggestion.date || "N/A"}</p>
          </div>

          <div>
            <h5 className="text-primary mb-2">Comments</h5>
            {suggestion.comments && suggestion.comments.length > 0 ? (
              <ul className="list-unstyled ms-3">
                {suggestion.comments.map((c, idx) => (
                  <li key={idx} className="mb-2">
                    <span className="text-muted">•</span> {c.text}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted">No comments yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  suggestions: state.movie.suggestions,
  loading: state.movie.loading,
});

export default connect(mapStateToProps, { getSuggestions })(SuggestionDetail);
