interface PrerequisitiesProps {
  description: string;
}

const SectionPrerequisities = ({ description }: PrerequisitiesProps) => {
  return (
    <div className='mb-12'>
      <h3 className='mb-4 font-goodHeadlineMedium text-xl uppercase tracking-wide text-lava'>
        Prerequisities
      </h3>
      <p className='max-w-[700] font-goodHeadlineMedium text-lg text-polyDarkerGray'>
        {description}
      </p>
    </div>
  );
};

export default SectionPrerequisities;
