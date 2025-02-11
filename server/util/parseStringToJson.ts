export const parseStringToJson = (stringifiedJson: string): Record<string, any> => {
    if (typeof stringifiedJson !== "string") return {};
    try {
      return JSON.parse(stringifiedJson);
    } catch (err) {
      return {};
    }
  };
  