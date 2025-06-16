import { LoaderSmall } from '../Loader';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  className?: React.HTMLAttributes<HTMLButtonElement>['className'];
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  isLoading?: boolean;
}

const Button = ({
  children,
  className,
  onClick = undefined,
  isLoading,
  ...rest
}: ButtonProps) => {
  return (
    <button
      {...rest}
      onClick={onClick}
      className={`flex items-center justify-center whitespace-nowrap border border-hpBlue px-4 py-[1px]  uppercase text-hpBlue no-underline transition-colors hover:bg-hpBlue hover:text-white ${className}`}
    >
      {isLoading ? (
        <span>
          <LoaderSmall />
        </span>
      ) : (
        <span>{children}</span>
      )}
    </button>
  );
};

export default Button;
