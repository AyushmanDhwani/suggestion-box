import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { connect } from "react-redux";
// import { getSuggestions, addCommentToSuggestion, updateSuggestionStatus } from "../../actions/moviesAction";
import { getSuggestions } from "../../actions/moviesAction";
import Axios from "../../api/axiosConfig";

import { Loading } from "../../components/common";
import "./style.css";


const SuggestionDetail = ({ suggestions, loading, getSuggestions }) => {
  const { id } = useParams();
  const [suggestion, setSuggestion] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);

  useEffect(() => {
    if (!suggestions?.length) getSuggestions();
  }, [suggestions, getSuggestions]);

  useEffect(() => {
    const found = suggestions.find((s) => String(s._id) === id);
    setSuggestion(found);
  }, [suggestions, id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setSubmitting(true);
    await addCommentToSuggestion(id, commentText);
    setCommentText("");
    setSubmitting(false);
    getSuggestions(); // Refresh suggestions
  };

  const handleStatusUpdate = async (newStatus) => {
    setStatusUpdating(true);
    await updateSuggestionStatus(id, newStatus);
    setStatusUpdating(false);
    getSuggestions(); // Refresh suggestions
  };

  // Add a comment using the API (with Axios and token)
  const addCommentToSuggestion = async (id, text) => {
    try {
      const userObj = JSON.parse(localStorage.getItem("user"));
      const token = userObj ? userObj.accessToken : null;
      const user = userObj ? userObj._id || userObj.id : null;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const createdAt = new Date().toISOString();
      const res = await Axios.post(`/api/suggestions/${id}/comment`, { text, user, createdAt }, config);
      setSuggestion(res.data);
    } catch (err) {
      // Optionally show error
    }
  };

  // Update status using the API (with Axios and token)
  const updateSuggestionStatus = async (id, newStatus) => {
    try {
      const userObj = JSON.parse(localStorage.getItem("user"));
      const token = userObj ? userObj.accessToken : null;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const updatedAt = new Date().toISOString();
      const res = await Axios.patch(`/api/suggestions/${id}`, { status: newStatus, updatedAt }, config);
      setSuggestion(res.data.updateSuggestion);
    } catch (err) {
      // Optionally show error
    }
  };

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
            <p><strong>Date:</strong> {suggestion.date || suggestion.createdAt || "N/A"}</p>
          </div>

          {/* Approve/Reject Buttons - now smaller and less prominent */}
          {(suggestion.status === "pending" || suggestion.status === "in-progress") && (
            <div className="mb-4 d-flex gap-2">
              <button
                className="btn btn-outline-success btn-sm"
                style={{ minWidth: 90 }}
                disabled={statusUpdating}
                onClick={() => handleStatusUpdate("resolved")}
              >
                Approve
              </button>
              <button
                className="btn btn-outline-danger btn-sm"
                style={{ minWidth: 90 }}
                disabled={statusUpdating}
                onClick={() => handleStatusUpdate("rejected")}
              >
                Reject
              </button>
            </div>
          )}

          {/* Comment Form and Comments Section - aligned and organized */}
          <div className="mb-4">
            <h5 className="text-primary mb-3">Comments</h5>
            <form onSubmit={handleCommentSubmit} className="d-flex align-items-center mb-3" style={{ maxWidth: 500 }}>
              <input
                type="text"
                className="form-control me-2"
                placeholder="Add a comment..."
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                disabled={submitting}
                style={{ flex: 1 }}
              />
              <button type="submit" className="btn btn-primary btn-sm" disabled={submitting || !commentText.trim()} style={{ minWidth: 80 }}>
                {submitting ? "Submitting..." : "Submit"}
              </button>
            </form>
            {suggestion.comments && suggestion.comments.length > 0 ? (
              <ul className="list-unstyled ms-1" style={{ maxWidth: 500 }}>
                {suggestion.comments.map((c, idx) => {
                  // Support both string and object comments
                  const commentText = typeof c === "string" ? c : c.text;
                  return (
                    <li key={idx} className="mb-2">
                      <span className="text-muted">•</span> {commentText}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-muted ms-1" style={{ maxWidth: 500 }}>No comments yet.</p>
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
