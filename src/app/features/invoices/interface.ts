export interface Invoice {
    clientId: string;
    clientName: string;
    currency: string;
    date: string;
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
    timers: any[];
    total: number;
  }