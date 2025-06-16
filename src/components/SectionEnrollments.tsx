import React from 'react';

interface EnrollmentsProps {
  children: React.ReactNode;
}

const SectionEnrollments = ({ children }: EnrollmentsProps) => {
  return (
    <div className='mb-12'>
      <h3 className='mb-4 font-goodHeadlineMedium text-xl uppercase tracking-wide text-lava'>
        Enrollments
      </h3>
      <div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>{children}</div>
    </div>
  );
};

export default SectionEnrollments;
