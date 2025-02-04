/**
 * Normalize and validate date input
 * @param inputDate - Any date format (ISO, DD-MM-YYYY, MM/DD/YYYY, timestamp, etc.)
 * @returns {string | null} - Returns formatted 'YYYY-MM-DD' date or null if invalid
 */
export const normalizeDate = (inputDate: string | Date | number | null | undefined): string | null => {
    try {
      if (!inputDate) throw new Error("Date input is missing");
  
      const parsedDate = new Date(inputDate);
  
      if (isNaN(parsedDate.getTime())) throw new Error("Invalid date format");
  
      return parsedDate.toISOString().split("T")[0]; // Extract YYYY-MM-DD
    } catch (error) {
      console.error(`Error normalizing date: ${(error as Error).message}`, { inputDate });
      return null; // Ensure invalid dates are handled
    }
  };