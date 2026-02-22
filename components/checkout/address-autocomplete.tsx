"use client";

import React from 'react';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';

interface AddressAutocompleteProps {
  onSelect: (address: string) => void;
  defaultValue?: string;
}

const AddressAutocomplete = ({ onSelect, defaultValue }: AddressAutocompleteProps) => {
  return (
    <div className="w-full">
      <GooglePlacesAutocomplete
        // FIX: Changed _KEY to _API_KEY to match your other files/env
        apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY} 
        selectProps={{
          defaultInputValue: defaultValue,
          placeholder: 'Search for your delivery address...',
          onChange: (val: any) => {
            if (val) {
              onSelect(val.label); 
            }
          },
          styles: {
            control: (provided, state) => ({
              ...provided,
              borderColor: state.isFocused ? '#7b1e3a' : '#e2e8f0',
              boxShadow: state.isFocused ? '0 0 0 1px #7b1e3a' : 'none',
              borderRadius: '0.5rem',
              padding: '4px',
              backgroundColor: '#fff',
              '&:hover': { borderColor: '#7b1e3a' },
            }),
            option: (provided, state) => ({
              ...provided,
              backgroundColor: state.isFocused ? '#fff7ed' : '#fff',
              color: '#1f2937',
              cursor: 'pointer',
              fontSize: '14px',
            }),
            input: (provided) => ({
                ...provided,
                color: '#1f2937',
            }),
            singleValue: (provided) => ({
                ...provided,
                color: '#1f2937',
            }),
          },
        }}
      />
    </div>
  );
};

export default AddressAutocomplete;