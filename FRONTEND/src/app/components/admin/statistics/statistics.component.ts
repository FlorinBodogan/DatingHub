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
  public chartUsers: any;
  public chartMatches: any;
  public chartMessages: any;

  canvasUsers!: any;
  canvasMatches!: any;
  canvasMessages!: any;

  allUsers = 0;
  allUsersUncorfirmed = 0;
  allUsersBanned = 0;

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.triggerFunctions();
  }

  ngAfterViewInit() {
    this.canvasUsers = document.getElementById('chartUsers');
    this.canvasMatches = document.getElementById('chartMatches');
    this.canvasMessages = document.getElementById('chartMessages');

    this.createChartUsers();
    this.createChartMatches();
    this.createChartMessasges();
  }

  onTabChange(event: MatTabChangeEvent): void {
    this.triggerFunctions();

    this.createChartUsers();
    this.createChartMatches();
    this.createChartMessasges();
  }

  triggerFunctions(): void {
    this.getUsers();
    this.getUsersUnconfirmed();
    this.getUsersBanned();
    this.getMatchesLastWeek();
    this.getMatchesLastMonth();
    this.getMatchesLastYear();
    this.getMessagesLastWeek();
    this.getMessagesLastMonth();
    this.getMessagesLastYear();
  }

  createChartUsers() {
    this.chartUsers = new Chart(this.canvasUsers, {
      type: 'bar',
      data: {
        labels: ["Users"],
        datasets: [
          {
            label: 'Users',
            data: [],
            backgroundColor: 'rgba(75, 192, 192, 0.7)',
          },
          {
            label: 'Uncorfirmed Users',
            data: [],
            backgroundColor: 'rgba(255, 99, 132, 0.7)',
          },
          {
            label: 'Banned Users',
            data: [],
            backgroundColor: 'rgba(255, 205, 86, 0.7)',
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
            text: 'Users',
            color: 'white'
          }
        }
      }
    });
  }

  createChartMatches() {
    this.chartMatches = new Chart(this.canvasMatches, {
      type: 'bar',
      data: {
        labels: ["Matches"],
        datasets: [
          {
            label: 'Matches last week',
            data: [],
            backgroundColor: 'rgba(54, 162, 235, 0.7)',
          },
          {
            label: 'Matches last month',
            data: [],
            backgroundColor: 'rgba(153, 102, 255, 0.7)',
          },
          {
            label: 'Matches last year',
            data: [],
            backgroundColor: 'rgba(255, 159, 64, 0.7)',
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
            text: 'Matches',
            color: 'white'
          }
        }
      }
    });
  }

  createChartMessasges() {
    this.chartMessages = new Chart(this.canvasMessages, {
      type: 'bar',
      data: {
        labels: ["Messages"],
        datasets: [
          {
            label: 'Messages last week',
            data: [],
            backgroundColor: 'rgba(255, 69, 0, 0.7)',
          },
          {
            label: 'Messages last month',
            data: [],
            backgroundColor: 'rgba(0, 128, 0, 0.7)',
          },
          {
            label: 'Messages last year',
            data: [],
            backgroundColor: 'rgba(128, 0, 128, 0.7)',
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
            text: 'Messages',
            color: 'white'
          }
        }
      }
    });
  }

  getUsers(): void {
    this.adminService.getUsers().subscribe({
      next: (response) => {
        this.pushOrUpdateDataset(this.chartUsers, 0, 'Users', response, 'rgba(75, 192, 192, 0.7)');
      }
    });
  };

  getUsersUnconfirmed(): void {
    this.adminService.getUsersUncorfirmed().subscribe({
      next: (response) => {
        this.pushOrUpdateDataset(this.chartUsers, 1, 'Uncorfirmed Users', response, 'rgba(255, 99, 132, 0.7)');
      }
    });
  };

  getUsersBanned(): void {
    this.adminService.getUsersBanned().subscribe({
      next: (response) => {
        this.pushOrUpdateDataset(this.chartUsers, 2, 'Banned Users', response, 'rgba(255, 205, 86, 0.7)');
      }
    });
  };

  getMatchesLastWeek(): void {
    this.adminService.getNumberOfMatchesLastWeek().subscribe({
      next: response => {
        this.pushOrUpdateDataset(this.chartMatches, 0, 'Matches last week', response, 'rgba(54, 162, 235, 0.7)')
      }
    })
  };

  getMatchesLastMonth(): void {
    this.adminService.getNumberOfMatchesLastMonth().subscribe({
      next: response => {
        this.pushOrUpdateDataset(this.chartMatches, 1, 'Matches last month', response, 'rgba(153, 102, 255, 0.7)')
      }
    })
  };

  getMatchesLastYear(): void {
    this.adminService.getNumberOfMatchesLastYear().subscribe({
      next: response => {
        this.pushOrUpdateDataset(this.chartMatches, 2, 'Matches last year', response, 'rgba(255, 159, 64, 0.7)')
      }
    })
  };

  getMessagesLastWeek(): void {
    this.adminService.getNumberOfMessagesLastWeek().subscribe({
      next: response => {
        this.pushOrUpdateDataset(this.chartMessages, 0, 'Messages last week', response, 'rgba(255, 69, 0, 0.7)')
      }
    })
  };

  getMessagesLastMonth(): void {
    this.adminService.getNumberOfMessagesLastYear().subscribe({
      next: response => {
        this.pushOrUpdateDataset(this.chartMessages, 1, 'Messages last month', response, 'rgba(0, 128, 0, 0.7)')
      }
    })
  };

  getMessagesLastYear(): void {
    this.adminService.getNumberOfMessagesLastYear().subscribe({
      next: response => {
        this.pushOrUpdateDataset(this.chartMessages, 2, 'Messages last year', response, 'rgba(128, 0, 128, 0.7)')
      }
    })
  };

  pushOrUpdateDataset(chart: any, index: number, label: string, data: any, backgroundColor: string) {
    const newDataItem = {
      label: label,
      data: [data],
      backgroundColor: [backgroundColor],
    };

    if (!chart.data.datasets[index]) {
      chart.data.datasets.push(newDataItem);
    } else {
      chart.data.datasets[index] = newDataItem;
    }

    chart.update();
  };
}
