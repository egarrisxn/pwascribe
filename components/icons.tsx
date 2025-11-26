interface IconProps {
  className?: string;
}

const XCloseIcon = ({ className }: IconProps) => (
  <svg
    className={className}
    xmlns='http://www.w3.org/2000/svg'
    width='24'
    height='24'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <path d='M18 6 6 18' />
    <path d='m6 6 12 12' />
  </svg>
);

const MicIcon = ({ className }: IconProps) => (
  <svg
    className={className}
    xmlns='http://www.w3.org/2000/svg'
    width='24'
    height='24'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <path d='M12 19v3' />
    <path d='M19 10v2a7 7 0 0 1-14 0v-2' />
    <rect x='9' y='2' width='6' height='13' rx='3' />
  </svg>
);

const MicOffIcon = ({ className }: IconProps) => (
  <svg
    className={className}
    xmlns='http://www.w3.org/2000/svg'
    width='24'
    height='24'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <path d='M12 19v3' />
    <path d='M15 9.34V5a3 3 0 0 0-5.68-1.33' />
    <path d='M16.95 16.95A7 7 0 0 1 5 12v-2' />
    <path d='M18.89 13.23A7 7 0 0 0 19 12v-2' />
    <path d='m2 2 20 20' />
    <path d='M9 9v3a3 3 0 0 0 5.12 2.12' />
  </svg>
);

const SettingsIcon = ({ className }: IconProps) => (
  <svg
    className={className}
    xmlns='http://www.w3.org/2000/svg'
    width='24'
    height='24'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <path d='M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915' />
    <circle cx='12' cy='12' r='3' />
  </svg>
);

const LoaderIcon = ({ className }: IconProps) => (
  <svg
    className={className}
    xmlns='http://www.w3.org/2000/svg'
    width='24'
    height='24'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <path d='M12 2v4' />
    <path d='m16.2 7.8 2.9-2.9' />
    <path d='M18 12h4' />
    <path d='m16.2 16.2 2.9 2.9' />
    <path d='M12 18v4' />
    <path d='m4.9 19.1 2.9-2.9' />
    <path d='M2 12h4' />
    <path d='m4.9 4.9 2.9 2.9' />
  </svg>
);

const MoonStarIcon = ({ className }: IconProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    className={className}
    width='24'
    height='24'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <path d='M18 5h4' />
    <path d='M20 3v4' />
    <path d='M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401' />
  </svg>
);

const SunIcon = ({ className }: IconProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    className={className}
    width='24'
    height='24'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <circle cx='12' cy='12' r='4' />
    <path d='M12 2v2' />
    <path d='M12 20v2' />
    <path d='m4.93 4.93 1.41 1.41' />
    <path d='m17.66 17.66 1.41 1.41' />
    <path d='M2 12h2' />
    <path d='M20 12h2' />
    <path d='m6.34 17.66-1.41 1.41' />
    <path d='m19.07 4.93-1.41 1.41' />
  </svg>
);

export {
  XCloseIcon,
  MicIcon,
  MicOffIcon,
  SettingsIcon,
  LoaderIcon,
  MoonStarIcon,
  SunIcon,
};
