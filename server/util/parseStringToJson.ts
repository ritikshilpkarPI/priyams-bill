export const parseStringToJson = (stringifiedJson: string): Record<string, any> => {
    if (typeof stringifiedJson !== "string") {
        throw new Error("Invalid input: Expected a JSON string");
    }
    try {
      return JSON.parse(stringifiedJson);
    } catch (err) {
        throw new Error("Invalid JSON format");
    }
  };
  