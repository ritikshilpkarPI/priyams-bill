export const generateSlug = (data: string) => {
  const trimmedData = data.trim(); 
  const slug = trimmedData
    .toLowerCase()            
    .replace(/[^a-z0-9-]/g, '-') 
    .replace(/-+/g, '-')         
    .replace(/^-+/, '')     
    .replace(/-+$/, '');       
  
  return slug;
};
