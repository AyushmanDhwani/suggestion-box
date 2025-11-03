import React from "react";
import { Link } from "react-router-dom";
import "./style.css";

export default function SuggestionsTable({ suggestions, currentPage, pageSize }) {
  const currentSuggestions = suggestions.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="suggestions-grid">
      {currentSuggestions.map((suggestion) => (
        <Link
          key={suggestion._id}
          to={`/suggestions/${suggestion._id}`}
          className="suggestion-card-link"
        >
          <div className="suggestion-card">
            <h4>{suggestion.title}</h4>
            <p>{suggestion.description}</p>
            <p>
              <strong>Status:</strong> {suggestion.status}
            </p>
            <p>
              <strong>Category:</strong>{" "}
              {suggestion.suggestionCategory?.name || "Uncategorized"}
            </p>
            <div>
              <strong>Comments:</strong>
              <ul>
                {suggestion.comments && suggestion.comments.length > 0 ? (
                  suggestion.comments.map((comment, idx) => (
                    <li key={idx}>{comment.text}</li>
                  ))
                ) : (
                  <li>No comments yet.</li>
                )}
              </ul>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
