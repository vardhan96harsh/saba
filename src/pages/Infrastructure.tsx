import infSpcBadge from '@assets/images/badges/SVG/inf_spc.svg';
import infProBadge from '@assets/images/badges/SVG/inf_pro.svg';
import allExpBadge from '@assets/images/badges/SVG/all_exp.svg';
import Container from '@/components/Container';
import SectionTitle from '@/components/SectionTitle';
import SectionReward from '@/components/SectionReward';
import SectionEnrollments from '@/components/SectionEnrollments';
import Header from '@/components/Header';
import SectionPrerequisities from '@/components/SectionPrerequisities';
import SectionCourseCard from '@/components/SectionCourseCard';
import { useApiContext } from '@/components/contexts/ApiContext';

const Infrastructure = () => {
  const { isPartner, data } = useApiContext();

  return (
    <>
      <Header
        backgroundImage='bg-infrastructure'
        title='Poly Infrastructure Solutions'
        description='The Poly Video track focuses on Poly Video solutions such as Poly Group Series, Poly Studio, Poly G7500 and X30/X50 endpoints, as well as the underlying technologies of audio and video, SIP & H.323, Call Servers and Device Management.'
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
                  course.level === 'specialist' &&
                  course.category.infrastructure
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
            image={infSpcBadge}
            description='Poly Infrastructure Specialist Certification'
          />
        </div>
      </Container>

      <Container>
        <div>
          <SectionTitle
            level='professional'
            description='The Professional program provides an intermediate level of technical information and knowledge for support staff, technicians and systems engineers who are responsible for the installation, configuration and support of small-to-medium sized Poly solution deployments.'
          />
          <SectionPrerequisities description='All specialist level requirements must be met prior to attaining professional level certifications. Only passing the required exams is necessary to attain certifications.' />
          <SectionEnrollments>
            {data
              .filter(
                (course) =>
                  course.level === 'professional' &&
                  course.category.infrastructure
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
            image={infProBadge}
            description='Poly Infrastructure Professional Certification'
          />
        </div>
      </Container>

      <Container>
        <div>
          <SectionTitle
            level='expert'
            description='The Expert program is designed for senior support staff, technical consultants, systems architects and solution designers who are responsible for the design, deployment and support of complex Poly solution deployments and systems integrations.'
          />
          <SectionPrerequisities description='Only after successfully achieving two Poly Professional level certifications, candidates are then eligible to join the Poly Infrastructure Professional program and work toward Poly Solutions Expert (POLY-XPT) status.' />
          <SectionEnrollments>
            {data
              .filter(
                (course) =>
                  course.level === 'expert' && course.category.infrastructure
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
            image={allExpBadge}
            description='Poly Solutions Expert Certification'
          />
        </div>
      </Container>
    </>
  );
};

export default Infrastructure;
