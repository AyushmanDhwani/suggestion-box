export default function (allSuggestions, suggestionCategory) {
  if (suggestionCategory === "All") return allSuggestions;
  else
    return allSuggestions.filter((suggestion) =>
      suggestion.suggestionCategory.some((cat) => cat.name === suggestionCategory)
    );
}
