import { useEffect, useState } from 'react';
import useData from 'src/useData';
import config from 'src/config';

export default function ImportDataPage() {
  const data = useData(config);
  console.log(data);
}
