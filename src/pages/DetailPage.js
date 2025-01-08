import React from 'react';
import { Hierarchy } from 'src/components/Hierarchy';
import useData from 'src/useData';
import config from 'src/config';

export default function DetailPage() {
  const data = useData(config);
  if (!data) {
    return null;
  }
  return <Hierarchy data={data.hierarchies['MC023CG-SY-FL']} />;
}
