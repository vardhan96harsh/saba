import Container from '@/components/Container';
import CalendarIcon from './icons/CalendarIcon';
interface LevelSectionProps {
  title: string;
  children: React.ReactNode;
}

const Specialist = () => (
  <p className='font-goodHeadlineRegular text-lg'>
    The <span className='font-goodHeadlineMedium'>SPECIALIST</span> program
    provides system operators, support staff, technicians and systems engineers
    with an entry level program that allows them to gain familiarity with the
    functions, features and operation of Poly solutions.
  </p>
);

const Professional = () => (
  <p className='font-goodHeadlineRegular text-lg'>
    The <span className='font-goodHeadlineMedium'>PROFESSIONAL</span> program
    provides an intermediate level of technical information and knowledge for
    support staff, technicians and systems engineers who are responsible for the
    installation, configuration and support of small-to-medium sized Poly
    solution deployments.
  </p>
);

const Expert = () => (
  <p className='font-goodHeadlineRegular text-lg'>
    The <span className='font-goodHeadlineMedium'>EXPERT</span> program is
    designed for senior support staff, technical consultants, systems architects
    and solution designers who are responsible for the design, deployment and
    support of complex Poly solution deployments and systems integrations.
  </p>
);

const LevelSection = ({ title, children }: LevelSectionProps) => (
  <div className='flex flex-col'>
    <h3 className='font-goodHeadlineMedium text-xl uppercase text-lava'>
      {title}
    </h3>
    <div className='mt-4 flex flex-1'>
      <div className='mr-3 w-[1px] bg-lava' />
      {children}
    </div>
  </div>
);

const WhatIsIt = () => {
  return (
    <Container>
      <div className='py-8'>
        <h2 className='font-goodHeadlineXcond text-5xl uppercase'>
          What is it
        </h2>
        <div className='mt-4 grid grid-cols-2 gap-10'>
          <p className='font-goodHeadlineRegular text-lg'>
            The{' '}
            <span className='font-goodHeadlineMedium'>
              POLY TECHNICAL EXPERT PROGRAM
            </span>{' '}
            provides individuals who are operating, supporting, installing and
            designing Poly solutions with access to a portfolio of learning and
            certification opportunities.
          </p>
          <p className='font-goodHeadlineRegular text-lg'>
            Structured in three levels,{' '}
            <span className='font-goodHeadlineMedium'>SPECIALIST</span>,{' '}
            <span className='font-goodHeadlineMedium'>PROFESSIONAL</span> and{' '}
            <span className='font-goodHeadlineMedium'>EXPERT</span>, and across
            multiple technology disciplines, the program provides you the
            freedom to choose your own route to learning and certification.
          </p>
        </div>
        <div className='mt-16 grid grid-cols-3 gap-12'>
          <LevelSection title='Poly Technical Specialist'>
            <Specialist />
          </LevelSection>
          <LevelSection title='Poly Technical Professional'>
            <Professional />
          </LevelSection>
          <LevelSection title='Poly Technical Expert'>
            <Expert />
          </LevelSection>
        </div>
        <div className='mx-auto mt-12 text-2xl'>
          <a
            href='https://hpi.sabacloud.com/Saba/Web_spf/HPI/app/workspace/detail/pgcnt000000000448639'
            className='mx-auto flex w-fit flex-col items-center justify-center bg-white p-8 text-lava shadow-lg transition-all hover:bg-lava hover:bg-opacity-5 hover:shadow-lavaOpacity'
          >
            <CalendarIcon className='h-auto w-full max-w-[150px]' />
            <span>ILT Training Calendar</span>
          </a>
        </div>
      </div>
    </Container>
  );
};

export default WhatIsIt;
