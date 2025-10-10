import React, { useState, useEffect, useMemo } from "react";
import { connect } from "react-redux";
import _ from "lodash";

import { search } from "../../utils";
import SuggestionsTable from "../../components/SuggestionsTable";
import { Input, Loading, ListGroup } from "../../components/common";

import { getSuggestions } from "../../actions/moviesAction";
import { getSuggestionCategories } from "../../actions/genreAction";

const Suggestions = (props) => {
  const [pageSize] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentCategory, setCurrentCategory] = useState("All");
  const [searchFilter, setSearchFilter] = useState("");

  useEffect(() => {
    props.getSuggestions();
    props.getSuggestionCategories();
  }, [props.loggedIn, props.getSuggestions, props.getSuggestionCategories]);

  const handleChange = (name, value) => {
    if (name === "currentCategory") {
      setCurrentCategory(value);
    } else if (name === "searchFilter") {
      setSearchFilter(value);
    }
    setCurrentPage(1);
  };

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  const { suggestions, suggestionCategories, loading } = props;
  const allCategories = [{ name: "All" }, ...suggestionCategories];

  const filteredSuggestions = useMemo(() => {
    let result = search(suggestions, searchFilter, "title");
    if (currentCategory !== "All") {
      result = result.filter(
        (s) => s.suggestionCategory && s.suggestionCategory.name === currentCategory
      );
    }
    return result;
  }, [suggestions, searchFilter, currentCategory]);

  if (loading) {
    return (
      <div className="background-container pt-5">
        <Loading />
      </div>
    );
  }

  return (
    <div className="background-container">
      <div className="mx-5 py-5">
        <div className="row">
          <div className="col-lg-2 col-sm-12 mt-10">
            <h4 className="text-muted text-left p-1">Filters</h4>
            <ListGroup
              active={currentCategory}
              onChange={(val) => handleChange("currentCategory", val)}
              options={allCategories}
            />
          </div>

          <div className="col-lg-10 col-sm-12">
            <Input
              onChange={(event) =>
                handleChange("searchFilter", event.target.value)
              }
              label="Search Suggestion"
              iconClass="fas fa-search"
              placeholder="Search..."
            />
            <p className="text-left text-muted">
              {!!filteredSuggestions.length ? `${filteredSuggestions.length} ` : "0"}
              suggestions found.
            </p>

            {!!filteredSuggestions ? (
              <SuggestionsTable
                pageSize={pageSize}
                currentPage={currentPage}
                suggestions={filteredSuggestions}
              />
            ) : (
              <h1 className="text-white">No Suggestions</h1>
            )}
            <br />
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  suggestions: state.movie.suggestions,
  suggestionCategories: state.genre.suggestionCategories,
  loading: state.movie.loading,
  loggedIn: state.auth.loggedIn,
});

export default connect(mapStateToProps, { getSuggestions, getSuggestionCategories })(Suggestions);
