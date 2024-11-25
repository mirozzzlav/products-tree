import { css } from '@emotion/css';

const style = {
  wrapper: css({
    height: '100%',
  }),
  svg: css({
    width: '100%',
    height: '100%',
  }),
  node: css({
    cursor: 'pointer',
    background: 'rgba(0,0,0,0.1)',
    padding: '2px 10px',
    overflowX: 'hidden',
    textOverflow: 'ellipsis',
    borderRadius: '4px',
    '> *': {
      fontSize: '12px',
      lineHeight: 1.4,
      textWrap: 'nowrap',
    },
  }),
};

export default style;
