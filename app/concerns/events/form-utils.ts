type FieldErrors = {
  [key: string]: string[] | undefined;
};

type ActionDataWithErrors = {
  error?: {
    fieldErrors?: FieldErrors;
  };
};

export type EventFormErrors = {
  name?: string;
  slug?: string;
  submissions?: string[];
};

export function extractEventFormErrors(
  actionData: ActionDataWithErrors | undefined,
): EventFormErrors | undefined {
  if (!actionData?.error?.fieldErrors || !('name' in actionData.error.fieldErrors)) {
    return undefined;
  }

  return {
    name: actionData.error.fieldErrors.name?.join(', '),
    slug: actionData.error.fieldErrors.slug?.join(', '),
    submissions: actionData.error.fieldErrors.submissions,
  };
}

type EventWithSubmissions = {
  name: string;
  slug: string;
  submissions: Array<{
    name: string;
    twitch: string;
    order: number;
  }>;
};

export type EventFormInitialValues = {
  name: string;
  slug: string;
  submissions: Array<{
    name: string;
    twitch: string;
    order: number;
  }>;
};

export function createEventFormInitialValues(
  event: EventWithSubmissions | undefined | null,
): EventFormInitialValues | undefined {
  if (!event) {
    return undefined;
  }

  return {
    name: event.name,
    slug: event.slug,
    submissions: event.submissions.map(s => ({
      name: s.name,
      twitch: s.twitch,
      order: s.order,
    })),
  };
}
