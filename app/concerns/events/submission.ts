export type Submission = {
  id: number;
  eventId: number;
  name: string;
  twitch: string;
  order: number;
};

export type SubmissionInput = {
  name: string;
  twitch: string;
  order: number;
};

export const loadSubmissionCsv = (file: File, onLoaded: (submissions: SubmissionInput[]) => void): void => {
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
