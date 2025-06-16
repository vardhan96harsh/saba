import expertmap from '@/assets/images/expertmap2.png';
import Container from '@components/Container';

const ExpertMap = () => {
  return (
    <Container>
      <div className='mx-auto flex max-w-[950px] flex-col py-8'>
        <h1 className='px-4 font-goodHeadlineXcond text-6xl uppercase text-polyGray md:text-8xl lg:text-10xl'>
          program map
        </h1>
        <img
          className='mx-auto'
          src={expertmap}
          alt='Poly Expert map diagram'
        ></img>
        <p className='mt-2 text-center'>
          <i className='text-[rgba(0,1,16,.5)]'>
            Source: Poly Technical Expert Program Diagram
          </i>
        </p>
      </div>
    </Container>
  );
};

export default ExpertMap;
