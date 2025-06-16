const Container = ({
  additionalClass = '',
  children,
}: {
  additionalClass?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={`mx-auto w-full max-w-[1440px] px-8 md:px-16 ${additionalClass}`}
    >
      {children}
    </div>
  );
};

export default Container;
