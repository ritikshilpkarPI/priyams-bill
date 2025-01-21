export const select = jest.fn(() => ({
    attr: jest.fn().mockReturnThis(),
    style: jest.fn().mockReturnThis(),
    append: jest.fn().mockReturnThis(),
    selectAll: jest.fn().mockReturnThis(),
    data: jest.fn().mockReturnThis(),
    enter: jest.fn().mockReturnThis(),
    call: jest.fn().mockReturnThis(),
    remove: jest.fn().mockReturnThis(),
  }));
  
  export const scaleBand = jest.fn(() => ({
    domain: jest.fn().mockReturnThis(),
    range: jest.fn().mockReturnThis(),
    padding: jest.fn().mockReturnThis(),
    bandwidth: jest.fn(() => 40),
  }));
  
  export const scaleLinear = jest.fn(() => ({
    domain: jest.fn().mockReturnThis(),
    range: jest.fn().mockReturnThis(),
  }));
  
  export const axisBottom = jest.fn(() => jest.fn());
  export const axisLeft = jest.fn(() => jest.fn());
  export const max = jest.fn(() => 100);