import { ArrowUpRight } from 'lucide-react';

export function SocialIcon({ label }: { label: string }) {
  const network = label.toLowerCase().replace(/[^a-z0-9]/g, '');
  const commonProps = {
    className: 'social-icon',
    viewBox: '0 0 24 24',
    'aria-hidden': true as const,
    focusable: false as const,
  };

  switch (network) {
    case 'linkedin':
      return (
        <svg {...commonProps}>
          <path d="M5.2 8.7a1.9 1.9 0 1 0 0-3.8 1.9 1.9 0 0 0 0 3.8ZM3.6 10.2h3.2V20H3.6zM9.2 10.2h3.1v1.35c.45-.85 1.4-1.6 3.05-1.6 3.25 0 4.05 2.05 4.05 4.75V20h-3.25v-4.7c0-1.15-.02-2.65-1.65-2.65-1.65 0-1.9 1.25-1.9 2.55V20H9.2z" />
        </svg>
      );
    case 'whatsapp':
      return (
        <svg {...commonProps}>
          <path d="M20.1 11.8a8.1 8.1 0 0 1-12 7.1L4 20l1.1-4a8.1 8.1 0 1 1 15-4.2Z" />
          <path d="M9 8.2c.2-.5.5-.5.8-.5h.5c.2 0 .4.1.5.4l.8 1.9c.1.2.1.4 0 .6l-.6.8c-.1.2-.1.3 0 .5.4.8 1.2 1.6 2 2 .2.1.4.1.5 0l.8-1c.2-.2.3-.2.6-.1l1.8.9c.2.1.3.3.3.5-.1.7-.4 1.2-1 1.5-.6.4-1.4.4-2.5 0-1.2-.5-2.5-1.5-3.3-2.6-.9-1.2-1.3-2.2-1.3-3.1 0-.7.3-1.3.7-1.8Z" />
        </svg>
      );
    case 'instagram':
      return (
        <svg {...commonProps}>
          <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.7" cy="6.6" r=".8" className="social-icon__dot" />
        </svg>
      );
    case 'facebook':
    case 'fb':
      return (
        <svg {...commonProps}>
          <path d="M13.5 21v-8h2.8l.4-3h-3.2V8.1c0-.9.3-1.5 1.6-1.5h1.7V4c-.3 0-1.4-.1-2.6-.1-2.6 0-4.3 1.6-4.3 4.4V10H7v3h2.9v8z" />
        </svg>
      );
    case 'youtube':
      return (
        <svg {...commonProps}>
          <path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4a2.5 2.5 0 0 0-1.8 1.8A26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8Z" />
          <path className="social-icon__cutout" d="m10 15.5 5-3.5-5-3.5z" />
        </svg>
      );
    case 'x':
    case 'twitter':
      return (
        <svg {...commonProps}>
          <path d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3L12 14.9 5.8 22H2.7L10 13.6 2 2h6.5l4.5 6.7L18.9 2Zm-1.1 18h1.7L7.4 3.9H5.6L17.8 20Z" />
        </svg>
      );
    case 'github':
      return (
        <svg {...commonProps}>
          <path d="M12 2.5a9.5 9.5 0 0 0-3 18.5c.5.1.7-.2.7-.5v-1.8c-2.8.6-3.4-1.2-3.4-1.2-.5-1.1-1.1-1.4-1.1-1.4-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.9.1-.6.4-1.1.6-1.3-2.2-.3-4.5-1.1-4.5-4.8 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.8 1a9.7 9.7 0 0 1 5.1 0c2-1.3 2.8-1 2.8-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.7-2.3 4.5-4.5 4.8.4.3.7.9.7 1.8v2.6c0 .3.2.6.7.5A9.5 9.5 0 0 0 12 2.5Z" />
        </svg>
      );
    case 'telegram':
      return (
        <svg {...commonProps}>
          <path d="m21.5 3.4-3.3 16.1c-.2 1.1-.8 1.4-1.7.9l-4.7-3.5-2.3 2.2c-.3.3-.5.5-1 .5l.4-4.8 8.8-8c.4-.4-.1-.6-.6-.2L6.2 13.5l-4.7-1.5c-1-.3-1-.9.2-1.4l18.5-7.1c.9-.3 1.6.2 1.3 1.9Z" />
        </svg>
      );
    default:
      return <ArrowUpRight aria-hidden="true" focusable="false" className="social-icon social-icon--fallback" />;
  }
}
