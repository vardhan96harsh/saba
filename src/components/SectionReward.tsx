interface RewardProps {
  description: string;
  image: string;
}

const SectionReward = ({ description, image }: RewardProps) => {
  return (
    <div className='mb-12'>
      <h3 className='mb-4 font-goodHeadlineMedium text-xl uppercase tracking-wide text-lava'>
        What you&apos;ll get
      </h3>
      <div>
        <p className='mb-4 max-w-[700] font-goodHeadlineMedium text-lg text-polyDarkerGray'>
          {description}
        </p>
        <img
          className='max-w-[150px]'
          src={image}
          alt='badge'
        />
      </div>
    </div>
  );
};

export default SectionReward;
