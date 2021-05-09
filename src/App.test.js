import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

it('renders without crashing', () => {
  const div = document.createElement('div');
  const head = document.createElement('head');
  ReactDOM.render(<App />, div);

  ReactDOM.render(<App />, head);
  ReactDOM.unmountComponentAtNode(div);
});
