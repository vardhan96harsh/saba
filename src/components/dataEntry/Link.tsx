interface ButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  label: string;
  href: string;
  onKeydown?: (event: React.KeyboardEvent<HTMLAnchorElement>) => void;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}

const Link = ({
  label,
  href,
  onClick = undefined,
  onKeydown = undefined,
  ...rest
}: ButtonProps) => {
  return (
    <a
      {...rest}
      href={href}
      onClick={onClick}
      onKeyDown={onKeydown}
      className='flex items-center whitespace-nowrap border border-hpBlue px-6 py-1	font-goodHeadlineMedium text-enrollButton uppercase text-hpBlue no-underline transition-colors hover:bg-hpBlue hover:text-white'
    >
      {label}
    </a>
  );
};

export default Link;
