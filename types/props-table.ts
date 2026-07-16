export interface PropsTableRow {
  name: string;
  type: string;
  default?: unknown;
  description?: string;
  required?: boolean;
  options?: unknown[];
  min?: number;
  max?: number;
}
