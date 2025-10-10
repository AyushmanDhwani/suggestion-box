import React from "react";
import Joi from "joi";
import { connect } from "react-redux";

import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import { Button } from "../../components/common";
import { addSuggestion } from "../../actions/suggestionsAction";
import { getSuggestionCategories } from "../../actions/suggestionCategoryAction";
import { suggestionSchema } from "./schema";

class AddSuggestionForm extends React.Component {
  _isMounted = false;

  state = {
    data: {
      title: "",
      suggestionCategory: "",
      approval: false,
      description: "",
      comments: [],
      reviewStatus: "pending",
    },
    errors: {},
  };

  componentDidMount() {
    this._isMounted = true;
    this.props.getSuggestionCategories();
  }

  componentDidUpdate(prevProps) {
    if (this.props.suggestionCategories.length > 0 && prevProps.suggestionCategories.length === 0) {
      this.setState((prevState) => ({
        data: {
          ...prevState.data,
          suggestionCategory: this.props.suggestionCategories[0]._id,
        },
      }));
    }
  }

  handleChange = ({ currentTarget: input }) => {
    const data = { ...this.state.data };
    data[input.name] = input.value;
    this.setState({ data });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { data } = this.state;
    const { error } = suggestionSchema.validate(data);
    this.setState({ errors: error ? error.details : {} });
    if (error) {
      console.log("Validation error:", error.details);
      return;
    }
    try {
      await this.props.addSuggestion(data, this.props.history);
      if (this._isMounted) {
        this.setState({
          data: {
            title: "",
            suggestionCategory: "",
            approval: false,
            description: "",
            comments: [],
            reviewStatus: "pending",
          },
          errors: {},
        });
      }
    } catch (err) {
      console.error("Error adding suggestion:", err);
    }
  };

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const { errors, data } = this.state;
    const { title, suggestionCategory, approval, description, comments, reviewStatus } = data;
    const { suggestionCategories } = this.props;

    return (
      <div className="background-container pt-5 pb-3">
        <div className="container">
          <h1 className="header">Add a new suggestion</h1>

          <form onSubmit={this.handleSubmit}>
            <Input
              name="title"
              value={title}
              label="Title"
              onChange={this.handleChange}
              placeholder="Enter the suggestion title..."
              error={errors["title"]}
              iconClass="fas fa-lightbulb"
              autoFocus
            />

            <Select
              name="suggestionCategory"
              label="Suggestion Category"
              onChange={this.handleChange}
              value={suggestionCategory}
              error={errors["suggestionCategory"]}
              options={suggestionCategories}
              iconClass="fas fa-list-alt"
            />

            <Input
              name="description"
              label="Description"
              placeholder="Enter description about this suggestion..."
              iconClass="fas fa-info"
              error={errors["description"]}
              type="textarea"
              value={description}
              onChange={this.handleChange}
            />

            <Input
              name="approval"
              label="Approval"
              type="checkbox"
              checked={approval}
              onChange={e => this.handleChange({ currentTarget: { name: "approval", value: e.target.checked } })}
            />

            <Input
              name="reviewStatus"
              label="Review Status"
              type="text"
              value={reviewStatus}
              onChange={this.handleChange}
              error={errors["reviewStatus"]}
              placeholder="pending/in review/approved/rejected"
            />

            <Button type="submit" label="Add Suggestion" />
          </form>
        </div>
      </div>
    );
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    addSuggestion: (suggestion, history) => dispatch(addSuggestion(suggestion, history)),
    getSuggestionCategories: () => dispatch(getSuggestionCategories()),
  };
};

const mapStateToProps = (state) => {
  return {
    suggestionCategories: state.suggestionCategory.suggestionCategories,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddSuggestionForm);
