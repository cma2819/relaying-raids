type Props = {
  level: 'h1' | 'h2';
  children: React.ReactNode;
};

export function Head({ level, children }: Props) {
  return (
    <>
      {level === 'h1' && <h1 className="text-xl font-bold text-center">{children}</h1>}
      {level === 'h2' && <h2 className="text-lg font-bold text-center">{children}</h2>}
    </>
  );
}
