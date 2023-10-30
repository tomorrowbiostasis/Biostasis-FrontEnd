import React from 'react';
import BioBasedTrigger from './components/BioBasedTrigger/BioBasedTrigger';
import TimeBasedTrigger from './components/TimeBasedTrigger/TimeBasedTrigger';

const AutomatedEmergency = () => {
  return (
    <>
      <BioBasedTrigger />
      <TimeBasedTrigger />
    </>
  );
};

export default AutomatedEmergency;
