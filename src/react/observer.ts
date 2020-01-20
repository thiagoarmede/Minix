import React, { useState } from 'react';

export const observer = (comp: React.Component) => {
  const [, setState] = useState({});

  function triggerRender() {
    setState({});
  }
};
