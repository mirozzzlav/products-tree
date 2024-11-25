import React from 'react';
import {
  BrowserRouter,
  Route as ReactRoute,
  Routes as RoutesReactDom,
} from 'react-router-dom';
import { Global } from '@emotion/react';
import { globalStyle as style } from 'src/style';
import pages from 'src/pages';

function App() {
  return (
    <>
      <Global styles={style} />
      <BrowserRouter>
        <RoutesReactDom>
          {pages.map(({ id, route, pageComponent }) => (
            <ReactRoute
              key={id}
              element={React.createElement(pageComponent)}
              path={route}
            />
          ))}
        </RoutesReactDom>
      </BrowserRouter>
    </>
  );
}

export default App;
