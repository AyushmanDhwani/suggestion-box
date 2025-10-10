import React from "react";
import Joi from "joi";
import { connect } from "react-redux";

import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import { Button } from "../../components/common";
import { addSuggestion } from "../../actions/moviesAction";
import { getSuggestionCategories } from "../../actions/genreAction";
import { suggestionSchema } from "./schema";

class AddSuggestionForm extends React.Component {
  _isMounted = false;

  state = {
    data: {
      title: "",
      suggestionCategory: "",
      description: "",
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
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(input);
    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];
    const data = { ...this.state.data };
    data[input.name] = input.value;
    this.setState({ data, errors });
  };

  validateProperty = (input) => {
    const { name, value } = input;
    const obj = { [name]: value };
    const subSchema = Joi.object({ [name]: suggestionSchema.extract(name) });
    const { error } = subSchema.validate(obj);
    return error ? error.details[0].message : null;
  };

  validate = () => {
    const options = { abortEarly: false };
    const { error } = suggestionSchema.validate(this.state.data, options);
    if (!error) return null;
    const errors = {};
    error.details.forEach((element) => (errors[element.path[0]] = element.message));
    return errors;
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const errors = this.validate();
    if (errors) {
      this.setState({ errors });
      return;
    }
    await this.props.addSuggestion(this.state.data, this.props.history);
    this.props.history.push("/suggestions");
  };

  render() {
    const { data, errors } = this.state;
    const { title, suggestionCategory, description } = data;
    const { suggestionCategories } = this.props;
    return (
      <div className="background-container pt-5">
        <div className="container">
          <h1 className="header">Add Suggestion</h1>
          <form onSubmit={this.handleSubmit}>
            <Input
              name="title"
              label="Title"
              type="text"
              error={errors["title"]}
              iconClass="fas fa-lightbulb"
              onChange={this.handleChange}
              placeholder="Enter your suggestion title..."
              value={title}
              autoFocus
            />
            <Select
              name="suggestionCategory"
              label="Suggestion Category"
              options={suggestionCategories}
              error={errors["suggestionCategory"]}
              onChange={this.handleChange}
              value={suggestionCategory}
            />
            <Input
              name="description"
              label="Description"
              type="text"
              error={errors["description"]}
              iconClass="fas fa-align-left"
              onChange={this.handleChange}
              placeholder="Describe your suggestion..."
              value={description}
            />
            <Button disabled={this.validate()} type="submit" label="Add Suggestion" />
          </form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  suggestionCategories: state.genre.suggestionCategories,
});

export default connect(mapStateToProps, { addSuggestion, getSuggestionCategories })(AddSuggestionForm);
