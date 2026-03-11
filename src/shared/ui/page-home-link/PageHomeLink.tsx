import { LinkAsButton } from '@/shared/ui';
import { linkStyles } from '@/shared/lib/styles/link.styles.ts';

export function PageHomeLink() {
  return (
      <LinkAsButton to={'/'} style={linkStyles}>
        Home
      </LinkAsButton>
  );
}