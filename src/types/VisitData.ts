
export interface VisitData {
  id: string;
  idPromotor?: string; // Nova propriedade para ID interno do promotor
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
