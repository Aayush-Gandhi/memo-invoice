export type Company = {
    id: string;
    name: string;
    address: string;
    phone: string;
    email: string;
    attention?: string;
  };
  
  export const getCompanies = (): Company[] =>
    JSON.parse(localStorage.getItem("companies") || "[]");
  
  export const saveCompanies = (companies: Company[]) =>
    localStorage.setItem("companies", JSON.stringify(companies));
  
  export const findCompanyByName = (name: string): Company | undefined =>
    getCompanies().find((c) => c.name.toLowerCase() === name.toLowerCase());
  