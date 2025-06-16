import { CourseLevel } from '@/types/types';

interface SectionTitleProps {
  level: CourseLevel;
  description: string;
}

const SectionTitle = ({ level, description }: SectionTitleProps) => {
  return (
    <div className='mb-12 mt-6 flex flex-col items-start md:flex-row md:items-center'>
      <h1 className='mb- mb-4 mr-6 font-goodHeadlineXcond text-6xl uppercase md:mb-0'>
        {level}
      </h1>
      <p className='text-polyDarkerGray mt-1 max-w-[800px] font-goodHeadlineMedium text-base'>
        {description}
      </p>
    </div>
  );
};

export default SectionTitle;
