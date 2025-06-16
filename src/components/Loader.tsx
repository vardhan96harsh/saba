import { Oval } from 'react-loader-spinner';

const Loader = () => {
  return (
    <Oval
      height={50}
      width={50}
      color='#0092D1'
      wrapperStyle={{}}
      wrapperClass='w-full flex justify-center p-10'
      visible={true}
      ariaLabel='oval-loading'
      secondaryColor='#0092D1aa'
      strokeWidth={4}
      strokeWidthSecondary={4}
    />
  );
};

const LoaderSmall = () => {
  return (
    <Oval
      height={30}
      width={30}
      color='#0092D1'
      wrapperStyle={{}}
      wrapperClass='w-full flex justify-center'
      visible={true}
      ariaLabel='oval-loading'
      secondaryColor='#0092D1aa'
      strokeWidth={5}
      strokeWidthSecondary={5}
    />
  );
};

export { Loader, LoaderSmall };
