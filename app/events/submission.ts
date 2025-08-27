export type Submission = {
  name: string;
  twitch: string;
  order: number;
};

export const loadSubmissionCsv = (file: File, onLoaded: (submissions: Submission[]) => void): void => {
  const reader = new FileReader();
  reader.onload = (event) => {
    const text = event.target?.result;
    if (typeof text === 'string') {
      const lines = text.split('\n');
      const submissions = lines.map((line, index) => {
        const [name, twitch] = line.split(',').map(s => s.trim());
        return { name, twitch, order: index + 1 };
      });
      onLoaded(submissions);
    }
    else {
      onLoaded([]);
    }
  };
  reader.onerror = () => {
    onLoaded([]);
  };
  reader.readAsText(file);
};
