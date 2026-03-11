import { LinkAsButton } from '@/shared/ui';
import { linkStyles } from '@/shared/ui/LinkStyles/link.styles.ts';

export function PageHomeLink() {
  return (
      <LinkAsButton to={'/'} style={linkStyles}>
        Home
      </LinkAsButton>
  );
}