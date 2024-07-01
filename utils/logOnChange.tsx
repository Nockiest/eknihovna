'use client'
import React, { useEffect } from 'react';

interface Props {
  val: any;
}

const LogOnChange: React.FC<Props> = ({ val }) => {
  useEffect(() => {
    console.log(val);
  }, [val]);

  return <React.Fragment></React.Fragment>; // This is a fragment, can be used as <React.Fragment></React.Fragment> or just <>
};

export default LogOnChange;
