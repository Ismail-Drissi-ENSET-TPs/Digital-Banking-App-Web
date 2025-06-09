import { Component, OnInit } from '@angular/core';
import { Chart, registerables, ChartConfiguration } from 'chart.js';
import { CurrencyPipe, DatePipe, NgIf, NgForOf, NgClass, CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { CustomerService } from '../services/customer.service';
import { AccountsService } from '../services/accounts.service';
import { AccountOperation } from '../models/account.model';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  standalone: true,
  imports: [
    CurrencyPipe,
    DatePipe,
    NgIf,
    NgForOf,
    NgClass,
    CommonModule,
    BaseChartDirective
  ],
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  // Basic stats
  totalCustomers: number = 0;
  totalAccounts: number = 0;
  totalOperations: number = 0;
  totalBalance: number = 0;


  // Recent data
  recentOperations: AccountOperation[] = [];
  recentCustomers: any[] = [];

  // Operation counts
  operationCounts = {
    DEBIT: 0,
    CREDIT: 0,
    TRANSFER: 0
  };

  // Account type distribution
  accountTypeCounts = {
    CURRENT_ACCOUNT: 0,
    SAVING_ACCOUNT: 0
  };

  // Loading states
  loading = {
    customers: false,
    accounts: false
  };



  // Chart configurations
  operationsChartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: ['DÉBIT', 'CRÉDIT', 'VIREMENT'],
    datasets: [{
      data: [0, 0, 0],
      backgroundColor: ['#dc3545', '#198754', '#0d6efd'],
      borderWidth: 2,
      borderColor: '#fff'
    }]
  };

  accountTypesChartData: ChartConfiguration<'pie'>['data'] = {
    labels: ['Compte Courant', 'Compte Épargne'],
    datasets: [{
      data: [0, 0],
      backgroundColor: ['#17a2b8', '#28a745'],
      borderWidth: 2,
      borderColor: '#fff'
    }]
  };

  monthlyChartData: ChartConfiguration<'line'>['data'] = {
    labels: this.getLastSixMonths(),
    datasets: [
      {
        label: 'Nouvelles Transactions',
        data: Array(6).fill(0),
        tension: 0.4,
        borderColor: '#0d6efd',
        backgroundColor: 'rgba(13, 110, 253, 0.1)',
        fill: true
      }
    ]
  };

  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  };

  constructor(
    private customerService: CustomerService,
    private accountService: AccountsService,
    private authService: AuthService
  ) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private getLastSixMonths(): string[] {
    const months = [];
    const currentDate = new Date();

    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(currentDate.getMonth() - i);
      months.push(date.toLocaleString('default', { month: 'short' }));
    }
    return months;
  }

  private updateCharts(operations: AccountOperation[]): void {
    // Reset counters
    this.operationCounts = { DEBIT: 0, CREDIT: 0, TRANSFER: 0 };
    const monthlyData = Array(6).fill(0);

    operations.forEach(op => {
      // Update operation type counts
      if (op.type in this.operationCounts) {
        this.operationCounts[op.type as keyof typeof this.operationCounts]++;
      }

      // Update monthly data
      const opDate = new Date(op.operationDate);
      const monthIndex = this.getMonthIndex(opDate);
      if (monthIndex !== -1) {
        monthlyData[monthIndex]++;
      }
    });

    // Update charts
    this.operationsChartData.datasets[0].data = [
      this.operationCounts.DEBIT,
      this.operationCounts.CREDIT,
      this.operationCounts.TRANSFER
    ];

    this.monthlyChartData.datasets[0].data = monthlyData;
  }

  private getMonthIndex(date: Date): number {
    const today = new Date();
    const monthsDiff = (today.getFullYear() - date.getFullYear()) * 12
      + today.getMonth() - date.getMonth();
    return monthsDiff <= 5 && monthsDiff >= 0 ? 5 - monthsDiff : -1;
  }

  loadDashboardData(): void {
    this.customerService.getCustomers().subscribe({
      next: (customers) => {
        this.totalCustomers = customers.length;
      },
      error: (error) => console.error('Error loading customers:', error)
    });

    this.accountService.getAccounts().subscribe({
      next: (accounts) => {
        this.totalAccounts = accounts.length;
        this.totalOperations = 0;
        this.totalBalance = 0;

        const allOperations: AccountOperation[] = [];

        accounts.forEach(account => {
          this.totalOperations += account.accountOperationDTOS.length;
          account.accountOperationDTOS.forEach(operation => {
            this.totalBalance += operation.amount;
            allOperations.push(operation);
          });
        });

        // Sort operations by date and get recent ones
        this.recentOperations = allOperations
          .sort((a, b) => new Date(b.operationDate).getTime() - new Date(a.operationDate).getTime())
          .slice(0, 10);

        this.updateCharts(allOperations);
      },
      error: (error) => console.error('Error loading accounts:', error)
    });
  }

  getOperationBadgeClass(type: string): string {
    switch (type) {
      case "DEBIT": return 'bg-danger';
      case "CREDIT": return 'bg-success';
      case "TRANSFER": return 'bg-primary';
      default: return 'bg-secondary';
    }
  }

  getOperationIcon(type: string): string {
    switch (type) {
      case "DEBIT": return 'bi bi-arrow-down-circle';
      case "CREDIT": return 'bi bi-arrow-up-circle';
      case "TRANSFER": return 'bi bi-arrow-left-right';
      default: return 'bi bi-question-circle';
    }
  }

  refreshDashboard(): void {
    this.loadDashboardData();
  }

  debugAuth(): void {
    console.log('🔍 === AUTH DEBUG START ===');
    this.authService.debugAuthStatus();
    console.log('🔍 === AUTH DEBUG END ===');
  }

  // Getter for current date (used in template)
  get currentDate(): Date {
    return new Date();
  }
}
