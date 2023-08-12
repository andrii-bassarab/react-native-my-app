import React, { useEffect, useRef } from 'react';

export function getPreviousValue(value: any) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}