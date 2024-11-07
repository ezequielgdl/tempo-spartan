export interface Invoice {
    clientId: string;
    clientName: string;
    currency: string;
    dueDate: string;
    id: string;
    invoiceNumber: string;
    irpfAmount: number;
    irpfRate: number;
    isPaid: boolean;
    issueDate: string;
    ivaAmount: number;
    ivaRate: number;
    notes: string;
    subject: string;
    subtotal: number;
    timers?: any[];
    items?: Item[];
    total: number;
  }

export interface Item {
  id: number;
  quantity: number;
  description: string;
  price: number;
  amount: number;
}
