import { linkStyles } from '@/shared/lib/styles/link.styles.ts';
import { LinkAsButton } from '@/shared/ui';

export function PageHomeLink() {
  return (
      <LinkAsButton to={'/'} style={linkStyles}>
        Home
      </LinkAsButton>
  );
}