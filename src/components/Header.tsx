import Container from '@components/Container';

interface HeaderProps {
  backgroundImage?:
    | 'bg-header'
    | 'bg-headset'
    | 'bg-voice'
    | 'bg-video'
    | 'bg-infrastructure'
    | 'bg-gradient-to-r from-indigo to-midnight';
  title: string;
  description: string;
  whiteTitle?: boolean;
}

const Header = ({
  backgroundImage = 'bg-gradient-to-r from-indigo to-midnight',
  title,
  description,
  whiteTitle = false,
}: HeaderProps) => {
  return (
    <header
      className={`w-full ${backgroundImage} flex min-h-[380px] items-center bg-center py-10`}
    >
      <Container>
        <div className='mb-4 flex max-w-3xl flex-col justify-center'>
          <h1
            className={`font-goodHeadlineXcond text-8xl uppercase ${
              whiteTitle ? 'text-white' : 'text-lava'
            }`}
          >
            {title}
          </h1>
          <p className='mt-4 text-lg text-white'>{description}</p>
        </div>
      </Container>
    </header>
  );
};

export default Header;
