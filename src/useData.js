// Replace with the URL of your .xlsx file

import * as XLSX from 'xlsx';
import { useEffect, useMemo, useState } from 'react';

function mapXLSXtoJSON(xlsxUrl, fieldNames) {
  return fetch(xlsxUrl)
    .then((response) => response.arrayBuffer())
    .then((data) => {
      const workbook = XLSX.read(data, { type: 'array' });
      return workbook.SheetNames.map((sheetName) => {
        const sheetJSON = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        return sheetJSON.map((obj) =>
          Object.fromEntries(
            Object.entries(fieldNames).map(([fName, fOriginalName]) => [
              fName,
              obj[fOriginalName],
            ]),
          ),
        );
      });
    });
}

// function findInChildren(sheetJSON, searchedRegNumber) {
//   const cached = {};
//
//   if (cached[searchedRegNumber]) {
//     return cached[searchedRegNumber];
//   }
//
//   return (
//     sheetJSON.find(({ regNumber }) => regNumber === searchedRegNumber) || null
//   );
// }

function parseData({ xlsxUrl, fieldNames }) {
  return mapXLSXtoJSON(xlsxUrl, fieldNames).then((sheetsJSON) => {
    let result = [];
    sheetsJSON.forEach((sheetJSON) => {
      result = [...result, ...sheetJSON];
    });
    return result;
  });
}

function findRoots(data) {
  const res = {};
  data.forEach((obj) => {
    let isParentAlsoChild = false;
    data.forEach(({ regNumber }) => {
      if (regNumber === obj.parentRegNumber) {
        isParentAlsoChild = true;
      }
    });
    if (!isParentAlsoChild) {
      res[obj.parentRegNumber] = {
        regNumber: obj.parentRegNumber,
        name: obj.parentName,
        SK: obj.parentSK,
      };
    }
  });
  return Object.values(res);
}

function findChildren({ regNumber: regNumberSearched }, data) {
  const tmp = {};
  data.forEach((obj) => {
    if (obj.parentRegNumber === regNumberSearched) {
      tmp[obj.regNumber] = obj;
    }
  });
  return Object.values(tmp);
}

function createHierarchy(root, data) {
  const { name, regNumber, parentRegNumber, parentSK, parentName, ...rest } =
    root;
  const result = {
    name,
    regNumber,
    data: rest,
    children: [],
  };

  const children = findChildren(root, data);
  if (!children) {
    return result;
  }
  return {
    ...result,
    children: children.map((ch) => createHierarchy(ch, data)),
  };
}

function useData(config) {
  const [data, setData] = useState(null);
  useEffect(() => {
    const tmpData = localStorage.getItem('products-data');
    if (tmpData) {
      setData(JSON.parse(tmpData));
    }
    parseData(config)
      .then((resp) => {
        localStorage.setItem('products-data', JSON.stringify(resp));
        setData(resp);
      })
      .catch((e) => console.error(`error -> ${e.message}`));
  }, []);

  return useMemo(() => {
    if (!data) {
      return null;
    }
    const roots = findRoots(data);
    return {
      hierarchies: Object.fromEntries(
        roots.map((r) => [r.regNumber, createHierarchy(r, data)]),
      ),
    };
  }, [data]);
}

export default useData;
