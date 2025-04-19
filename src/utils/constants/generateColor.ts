export const generateColor = (id?: string): string => {
    if (!id) {
      const hue = Math.floor(Math.random() * 360);
      return `hsl(${hue}, 65%, 55%)`;
    }
  
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
  
    const hue = Math.abs(hash) % 360;
    return `hsl(${hue}, 65%, 55%)`;
  };
  