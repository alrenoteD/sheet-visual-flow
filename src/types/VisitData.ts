
export interface VisitData {
  id: string;
  promotor: string;
  rede: string;
  cidade: string;
  marca: string;
  visitasPreDefinidas: number;
  visitasRealizadas: number;
  percentual: number;
  telefone: string;
  dataInicio: string;
  valorContrato: number;
  valorPorVisita: number;
  valorPago: number;
  datasVisitas: string[];
}

export interface GoogleSheetsConfig {
  apiKey: string;
  spreadsheetId: string;
  range: string;
}
