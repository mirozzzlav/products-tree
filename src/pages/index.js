import ImportDataPage from 'src/pages/ImportDataPage';
import DetailPage from 'src/pages/DetailPage';
import ListPage from 'src/pages/ListPage';

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
  {
    id: 'import-data',
    route: 'import-data',
    pageComponent: ImportDataPage,
  },
];

export default pages;
