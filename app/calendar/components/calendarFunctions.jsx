export const getRecurrenceRule = (selectedRecurrence, customRrule) => {
  switch (selectedRecurrence) {
    case "DAILY":
      return "RRULE:FREQ=DAILY;COUNT=5";
    case "WEEKLY":
      return "RRULE:FREQ=WEEKLY;COUNT=5;";
    case "MONTHLY":
      return "RRULE:FREQ=MONTHLY;COUNT=5;";
    case "YEARLY":
      return "RRULE:FREQ=YEARLY;COUNT=5;";
    case "custom":
      return customRrule;
    default:
      return null;
  }
};
