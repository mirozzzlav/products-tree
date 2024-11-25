import DetailPage from './DetailPage';
import ListPage from './ListPage';

const pages = [
  {
    id: 'home',
    route: '/',
    pageComponent: ListPage,
  },
  {
    id: 'detail',
    route: 'detail',
    pageComponent: DetailPage,
  },
  {
    id: 'list',
    route: 'list',
    pageComponent: ListPage,
  },
];

export default pages;
