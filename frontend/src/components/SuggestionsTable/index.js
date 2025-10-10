import React from "react";
import "./style.css";

export default function SuggestionsTable({ suggestions, currentPage, pageSize }) {
  const currentSuggestions = suggestions.slice(
    (currentPage - 1) * pageSize,
    pageSize * currentPage
  );

  return (
    <div className="suggestions-grid">
      {currentSuggestions.map((suggestion) => (
        <div className="suggestion-card" key={suggestion._id}>
          <h4>{suggestion.title}</h4>
          <p>{suggestion.description}</p>
          <p><strong>Status:</strong> {suggestion.status}</p>
          <p><strong>Category:</strong> {suggestion.suggestionCategory?.name || "Uncategorized"}</p>
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
      ))}
    </div>
  );
}
