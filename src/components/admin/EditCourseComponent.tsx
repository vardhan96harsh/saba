import {
  Course,
  CourseCategory,
  CourseCode,
  CourseType,
  EnrollmentType,
} from '@/types/types';
import { useCallback } from 'react';
import { useApiContext } from '../contexts/ApiContext';
import { TextField } from '../dataEntry';
import ListComponent from '../dataEntry/ListComponent';
import SwitchComponent from '../dataEntry/SwitchComponent';

interface EditCourseComponentProps {
  course: Course;
  index: number;
}

const enrollmentTypeOptions: EnrollmentType[] = [
  'Course',
  'Course with exam',
  'Exam',
];

const typeOptions: CourseType[] = [
  'Certification',
  'E-learning',
  'Instructor-Led',
  'Virtual Instructor-Led',
];

const EditCourseComponent = ({
  course: {
    code,
    image,
    title,
    duration,
    enrollmentType,
    type,
    link,
    partnerLink,
    category,
  },
  index,
}: EditCourseComponentProps) => {
  const { data, setData } = useApiContext();

  const handleChange = useCallback(
    (value: string, propertyName: keyof Course) => {
      const dataCopy: Course[] = JSON.parse(JSON.stringify(data));

      switch (propertyName) {
        case 'title':
          dataCopy[index].title = value;
          break;
        case 'code':
          dataCopy[index].code = value as CourseCode;
          break;
        case 'duration':
          dataCopy[index].duration = value;
          break;
        case 'image':
          dataCopy[index].image = value;
          break;
        case 'enrollmentType':
          dataCopy[index].enrollmentType = value as EnrollmentType;
          break;
        case 'type':
          dataCopy[index].type = value as CourseType;
          break;
        case 'link':
          dataCopy[index].link = value;
          break;
        case 'partnerLink':
          dataCopy[index].partnerLink = value;
          break;
        default:
          break;
      }

      setData(dataCopy);
    },
    [data, index, setData]
  );

  const handleChangeSwitch = useCallback(
    (checked: boolean, propertyName: keyof CourseCategory) => {
      const dataCopy: Course[] = JSON.parse(JSON.stringify(data));

      dataCopy[index].category[propertyName] = checked;
      setData(dataCopy);
    },
    [data, index, setData]
  );

  return (
    <section className='flex h-full overflow-hidden'>
      <div className='flex-1 border-r py-2'>
        <div className='mb-4 px-4 font-goodHeadlineMedium text-2xl uppercase text-lava text-opacity-100'>
          {title}
        </div>
        <fieldset className='flex h-full flex-col gap-4 overflow-auto px-4'>
          <div className='flex gap-2'>
            <TextField
              label='Title'
              value={title || ''}
              propertyName='title'
              onChange={handleChange}
            />
            <TextField
              label='Code'
              value={code || ''}
              propertyName='code'
              onChange={handleChange}
            />
          </div>
          <div className='flex gap-2'>
            <TextField
              label='Duration'
              value={duration || ''}
              propertyName='duration'
              onChange={handleChange}
            />
            <TextField
              label='Image location'
              value={image || ''}
              propertyName='image'
              onChange={handleChange}
            />
          </div>
          <div className='flex gap-2'>
            <ListComponent
              label='Enrollment Type'
              value={enrollmentType}
              options={enrollmentTypeOptions}
              propertyName='enrollmentType'
              onChange={handleChange}
            />
            <ListComponent
              label='Course Type'
              value={type}
              options={typeOptions}
              propertyName='type'
              onChange={handleChange}
            />
          </div>
          <TextField
            label='Internal Link'
            value={link || ''}
            propertyName='link'
            onChange={handleChange}
          />
          <TextField
            label='Partner Link'
            value={partnerLink || ''}
            propertyName='partnerLink'
            onChange={handleChange}
          />
          <div>
            <div className='font-goodHeadlineMedium text-sm text-black text-opacity-50'>
              Course Category
            </div>
            <div className='flex gap-4 py-2'>
              <SwitchComponent
                label='Headset'
                enabled={category.headset}
                propertyName='headset'
                onChange={handleChangeSwitch}
              />
              <SwitchComponent
                label='Infrastructure'
                enabled={category.infrastructure}
                propertyName='infrastructure'
                onChange={handleChangeSwitch}
              />
              <SwitchComponent
                label='Video'
                enabled={category.video}
                propertyName='video'
                onChange={handleChangeSwitch}
              />
              <SwitchComponent
                label='Voice'
                enabled={category.voice}
                propertyName='voice'
                onChange={handleChangeSwitch}
              />
            </div>
          </div>
        </fieldset>
      </div>
      <div className='px-4 py-2'>
        <div className='font-goodHeadlineMedium uppercase tracking-wider text-black text-opacity-70'>
          Image preview
        </div>
        <img
          className='mt-2 w-full rounded-md object-cover'
          src={image}
          alt={title}
        />
      </div>
    </section>
  );
};

export default EditCourseComponent;
