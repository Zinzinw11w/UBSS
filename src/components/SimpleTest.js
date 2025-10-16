import React from 'react';
import { useParams, useLocation } from 'react-router-dom';

const SimpleTest = () => {
  const { category } = useParams();
  const location = useLocation();
  
  // Extract symbol from the pathname
  const pathParts = location.pathname.split('/');
  const symbol = pathParts.slice(3).join('/'); // Get everything after /trading/category/
  
  return (
    <div style={{ padding: '20px', backgroundColor: 'lightblue', minHeight: '100vh' }}>
      <h1 style={{ color: 'red', fontSize: '48px' }}>SUCCESS!</h1>
      <h2>Category: {category || 'UNDEFINED'}</h2>
      <h2>Symbol: {symbol || 'UNDEFINED'}</h2>
      <p>If you can see this, the routing is working!</p>
      <div style={{ backgroundColor: 'yellow', padding: '10px', margin: '10px' }}>
        <strong>URL Parameters Debug:</strong><br/>
        Category: "{category}"<br/>
        Symbol: "{symbol}"<br/>
        Full URL: {window.location.href}<br/>
        Pathname: {location.pathname}
      </div>
    </div>
  );
};

export default SimpleTest;
