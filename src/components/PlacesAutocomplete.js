import React from 'react';
import PlacesAutocomplete from 'react-places-autocomplete';

const Autocomplete = (props) => {
  return(
    <PlacesAutocomplete
      value={props.query}
      onChange={props.handleChange}
      onSelect={props.handleSelect}>
        {({ getInputProps, suggestions, getSuggestionItemProps }) => (
          <div>
            <input
              {...getInputProps({
              placeholder: 'Search Places ...',
              className: 'location-search-input'
              })}
            />
            <div className="autocomplete-dropdown-container">
              {suggestions.map(suggestion => {
                const className = suggestion.active ? 'suggestion-item--active' : 'suggestion-item';
                // inline style for demonstration purpose
                const style = suggestion.active
                ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                : { backgroundColor: '#ffffff', cursor: 'pointer' };
                return (
                  <div {...getSuggestionItemProps(suggestion, { className, style })}>
                    <span>{suggestion.description}</span>
                  </div>
                )
              })}
          </div>
        </div>
      )}
    </PlacesAutocomplete>
  );
}

export default Autocomplete;
