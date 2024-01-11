import { Component, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Chart, registerables } from 'chart.js';
import { AdminService } from 'src/app/services/admin/admin.service';
Chart.register(...registerables);

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.scss'
})
export class StatisticsComponent implements OnInit {
  public chart: any;
  canvas!: any;

  users: number[] = [];
  matches: number[] = [];
  messages: number[] = [];

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.triggerFunctions();
  }

  ngAfterViewInit() {
    this.canvas = document.getElementById('chart');
    this.createChart();
  }

  onTabChange(event: MatTabChangeEvent): void {
    this.triggerFunctions();
    this.createChart();
  }

  triggerFunctions(): void {
    this.getUsers7days();
    this.getUsers30days();
    this.getUsers365days();
    this.getMatchesLastWeek();
    this.getMatchesLastMonth();
    this.getMatchesLastYear();
    this.getMessagesLastWeek();
    this.getMessagesLastMonth();
    this.getMessagesLastYear();
  }

  createChart() {
    this.chart = new Chart(this.canvas, {
      type: 'bar',
      data: {
        labels: ["Last 7 days", "Last month", "Last year"],
        datasets: [
          {
            label: 'Users',
            data: this.users,
            backgroundColor: 'rgba(50, 40, 192, 0.8)',
          },
          {
            label: 'Matches',
            data: this.matches,
            backgroundColor: 'rgba(255, 70, 132, 0.8)',
          },
          {
            label: 'Messages',
            data: this.messages,
            backgroundColor: 'rgba(255, 205, 86, 0.8)',
          },
        ],
      },
      options: {
        aspectRatio: 2.2,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: '#ddd'
            }
          },
          title: {
            display: true,
            text: 'Statistics',
            color: 'white'
          }
        }
      }
    });
  }

  getUsers7days(): void {
    this.adminService.getUsers7days().subscribe({
      next: (response: number) => {
        this.users[0] = response
        this.chart.update();
      }
    });
  };

  getUsers30days(): void {
    this.adminService.getUsers30days().subscribe({
      next: (response) => {
        this.users.push(response)
        this.chart.update();
      }
    });
  };

  getUsers365days(): void {
    this.adminService.getUsers365days().subscribe({
      next: (response) => {
        this.users.push(response)
        this.chart.update();
      }
    });
  };

  getMatchesLastWeek(): void {
    this.adminService.getNumberOfMatchesLastWeek().subscribe({
      next: response => {
        this.matches.push(response)
        this.chart.update();
      }
    })
  };

  getMatchesLastMonth(): void {
    this.adminService.getNumberOfMatchesLastMonth().subscribe({
      next: response => {
        this.matches.push(response)
        this.chart.update();
      }
    })
  };

  getMatchesLastYear(): void {
    this.adminService.getNumberOfMatchesLastYear().subscribe({
      next: response => {
        this.matches.push(response)
        this.chart.update();
      }
    })
  };

  getMessagesLastWeek(): void {
    this.adminService.getNumberOfMessagesLastWeek().subscribe({
      next: response => {
        this.messages.push(response)
        this.chart.update();
      }
    })
  };

  getMessagesLastMonth(): void {
    this.adminService.getNumberOfMessagesLastYear().subscribe({
      next: response => {
        this.messages.push(response)
        this.chart.update();
      }
    })
  };

  getMessagesLastYear(): void {
    this.adminService.getNumberOfMessagesLastYear().subscribe({
      next: response => {
        this.messages.push(response)
        this.chart.update();
      }
    })
  };
}
