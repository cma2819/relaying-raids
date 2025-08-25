import { Paper as MantinePaper, type PaperProps} from '@mantine/core';

type Props = {
  children: React.ReactNode;
} & PaperProps;

export function Paper({ children, ...props }: Props) {
  return (
    <MantinePaper withBorder p='md' radius='md' {...props}>
      {children}
    </MantinePaper>
  );
}
