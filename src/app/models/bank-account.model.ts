export interface BankAccountDTO {
  id: string;
  balance: number;
  createdAt: Date;
  status: string;
  customerDTO: {
    id: number;
    name: string;
    email: string;
  };
  type: string;
}

export interface AccountOperationDTO {
  id: number;
  operationDate: Date;
  amount: number;
  type: string;
  description: string;
}

export interface AccountHistoryDTO {
  accountId: string;
  balance: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  accountOperationDTOS: AccountOperationDTO[];
}
