import { Popover, PopoverTrigger, PopoverContent } from './utility/Popover';
import PDFIcon from '@components/icons/PDFIcon';
import { Course, CourseCode, CourseType, ExamData } from '@/types/types';

interface CourseCardProps extends Omit<Course, 'category' | 'level'> {
  isPartner?: boolean;
}

interface CourseDetailsProps {
  title: string;
  code?: CourseCode;
  type?: CourseType;
  duration?: string;
}

interface EnrollButtonProps {
  link?: string;
  linkText?: string;
}

interface ExamButtonProps {
  examData: ExamData;
  isPartner: boolean;
}

const tableHeaders = [
  'Exam Title',
  'Exam ID',
  'Proctored',
  'Questions',
  'Pass %',
  'Exam Duration',
  'Exam Guide',
];

const Tag = ({ text }: { text: string }) => (
  <li className='bg-navigationHoverActive p-2 font-goodHeadlineRegular text-base text-lava'>
    {text}
  </li>
);

const EnrollButton = ({ link, linkText }: EnrollButtonProps) => {
  return (
    <a
      href={link}
      target='_blank'
      className={`h-full whitespace-nowrap border px-6 font-goodHeadlineMedium text-enrollButton uppercase	no-underline transition-colors ${
        link
          ? 'border-lava text-lava hover:bg-lava hover:text-white'
          : 'pointer-events-none border-polyDarkerGray text-polyDarkerGray'
      }`}
      rel='noreferrer'
    >
      {link && !linkText ? 'Enroll now' : null}
      {link && linkText ? linkText : null}
      {!link ? 'Not available' : null}
    </a>
  );
};

const ExamTable = ({ examData, isPartner }: ExamButtonProps) => (
  <div className='rounded-xl bg-white shadow-lg'>
    <p className='border-b border-polyGray px-4 py-2'>
      <a
        href={`${
          isPartner
            ? 'https://home.pearsonvue.com/hpi'
            : examData.link || 'https://poly.com/expert-exams'
        }`}
        target='_blank'
        rel='noreferrer'
        className='text-lava underline'
      >
        Register
      </a>{' '}
      for the exam
    </p>
    <div>
      <table>
        <thead>
          <tr>
            {tableHeaders.map((header) => (
              <th
                key={header}
                className='px-4 py-4 text-left text-sm uppercase'
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {Object.entries(examData)
              .filter(([key]) => key !== 'link')
              .map(([key, value]) => (
                <td
                  key={key}
                  className='max-w-[180px] px-4 py-2 font-goodHeadlineMedium text-sm'
                >
                  {key !== 'blueprintLink' ? value : null}
                  {key === 'blueprintLink' ? (
                    <a
                      href={examData.blueprintLink}
                      target='_blank'
                      rel='noreferrer'
                      className='flex flex-col items-center text-lava'
                    >
                      <PDFIcon />
                      <span>Download</span>
                    </a>
                  ) : null}
                </td>
              ))}
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);

const ExamButton = ({ examData, isPartner }: ExamButtonProps) => {
  return (
    <Popover>
      <PopoverTrigger className='px-2 font-goodHeadlineMedium text-enrollButton uppercase text-lava underline hover:text-lavaLight'>
        exam details
      </PopoverTrigger>
      <PopoverContent>
        <ExamTable
          examData={examData}
          isPartner={isPartner}
        />
      </PopoverContent>
    </Popover>
  );
};

const CourseDetails = ({ title, code, duration, type }: CourseDetailsProps) => (
  <>
    <h4 className='mb-2 font-goodHeadlineMedium text-xl'>{title}</h4>
    <ul className='flex gap-2'>
      {code?.length && <Tag text={code} />}
      {duration?.length && <Tag text={duration} />}
      {type?.length && <Tag text={type} />}
    </ul>
  </>
);

const SectionCourseCard = ({
  code,
  image,
  title,
  duration,
  type,
  link,
  partnerLink,
  examData,
  isPartner = false,
}: CourseCardProps) => (
  <div
    className='relative flex flex-row bg-[#f6f6f6]'
    id={code}
  >
    <img
      className='h-full max-h-[200px] w-full max-w-[180px] object-cover'
      src={image}
      alt={title}
    />
    <div className='flex flex-1 flex-col px-4 pb-4 pt-2'>
      <CourseDetails
        title={title}
        code={code}
        type={type}
        duration={duration}
      />
      <div className='mt-6 flex items-center gap-4'>
        {type !== 'Certification' ? (
          <>
            {isPartner && <EnrollButton link={partnerLink} />}
            {!isPartner && <EnrollButton link={link} />}
            {examData && (
              <ExamButton
                examData={examData}
                isPartner={isPartner}
              />
            )}
          </>
        ) : null}
      </div>
    </div>
  </div>
);

export default SectionCourseCard;
