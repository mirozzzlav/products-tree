import { css } from '@emotion/css';

export const breakPoints = {
  xs: 576,
  sm: 768,
  md: 992,
  lg: 1200,
};

export const mediaQueries = Object.fromEntries(
  Object.entries(breakPoints).map(([k, bp]) => [
    k,
    `@media (min-width: ${bp}px)`,
  ]),
);

export const globalStyle = {
  '*': {
    boxSizing: 'border-box',
    lineHeight: '1.5',
    fontWeight: '400',
    color: '#000',
    fontFamily: 'Tahoma, sans-serif',
    fontSize: '16px',
  },
  '#root': {
    height: '100vh',
  },
};
