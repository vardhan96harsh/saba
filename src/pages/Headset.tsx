import hedSpcBadge from '@assets/images/badges/SVG/hed_spc.svg';
import Container from '@/components/Container';
import SectionTitle from '@/components/SectionTitle';
import SectionReward from '@/components/SectionReward';
import SectionEnrollments from '@/components/SectionEnrollments';
import Header from '@/components/Header';
import SectionPrerequisities from '@/components/SectionPrerequisities';
import SectionCourseCard from '@/components/SectionCourseCard';
import { useApiContext } from '@/components/contexts/ApiContext';

const Headset = () => {
  const { isPartner, data } = useApiContext();

  return (
    <>
      <Header
        backgroundImage='bg-headset'
        title='Poly Headset Solutions'
        description='The Poly Headset track focuses on Poly Headset solutions and technologies for the Encore Pro, Blackwire, Voyager, and Savi families, as well as Poly Sync and Specials.'
      />

      <Container>
        <div>
          <SectionTitle
            level='specialist'
            description='The Poly Specialist level training program provides system operators, support staff, technicians and systems engineers with an entry level program that allows them to gain familiarity with the functions, features and operation of Poly solutions.'
          />
          <SectionPrerequisities description='There are no prerequisities for the specialist level' />
          <SectionEnrollments>
            {data
              .filter(
                (course) =>
                  course.level === 'specialist' && course.category.headset
              )
              .map(({ ...rest }) => (
                <SectionCourseCard
                  {...rest}
                  isPartner={isPartner}
                  key={rest.code}
                />
              ))}
          </SectionEnrollments>
          <SectionReward
            image={hedSpcBadge}
            description='Poly Headset Specialist Certification'
          />
        </div>
      </Container>
    </>
  );
};

export default Headset;
