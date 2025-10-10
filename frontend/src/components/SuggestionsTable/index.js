import React from "react";

export default function SuggestionsTable({ suggestions, currentPage, pageSize }) {
  const currentSuggestions = suggestions.slice(
    (currentPage - 1) * pageSize,
    pageSize * currentPage
  );

  return (
    <div className="suggestions-grid">
      {!!suggestions &&
        currentSuggestions.map((suggestion) => (
          <div key={suggestion._id} className="suggestion-card">
            <h4>{suggestion.title}</h4>
            <p><b>Category:</b> {suggestion.suggestionCategory.map(cat => cat.name).join(", ")}</p>
            <p><b>Description:</b> {suggestion.description}</p>
            <p><b>Approval:</b> {suggestion.approval ? "Approved" : "Pending"}</p>
            <p><b>Review Status:</b> {suggestion.reviewStatus}</p>
            <p><b>Comments:</b> {suggestion.comments && suggestion.comments.length ? suggestion.comments.join(", ") : "None"}</p>
          </div>
        ))}
    </div>
  );
}
