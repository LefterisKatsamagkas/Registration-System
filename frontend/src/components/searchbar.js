import React from 'react';

const Searchbar = ({ value, setValue}) => {
  return (
    <div className='searchbar'>
      <input
        style={{
          border: '1px solid #6448ef',
          borderRadius: '1rem',
          padding: '0.5rem',
          backgroundColor: '#ffffff',
          color: 'black',
          width: '100%',
        }}
        type='search'
        placeholder={'Search'}
        value={value}
        onChange={(e)=>setValue(e.target.value)}
      />
    </div>
  );
};

export default Searchbar;