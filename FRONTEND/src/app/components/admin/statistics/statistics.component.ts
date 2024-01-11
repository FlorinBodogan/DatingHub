import { Component, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Chart, registerables } from 'chart.js';
import { MatchesCount } from 'src/app/interfaces/statistics/matchesCount';
import { MessagesCount } from 'src/app/interfaces/statistics/messagesCount';
import { UsersCount } from 'src/app/interfaces/statistics/usersCount';
import { AdminService } from 'src/app/services/admin/admin.service';
Chart.register(...registerables);

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.scss'
})
export class StatisticsComponent implements OnInit {
  chartUsers: any;
  chartMatches: any;
  chartMessages: any;

  users?: number[] = [];
  matches: number[] = [];
  messages?: number[] = [];

  randomColors1 = Array.from({ length: 6 }, () =>
    `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(
      Math.random() * 256
    )}, ${Math.floor(Math.random() * 256)}, 0.8)`
  );
  randomColors2 = Array.from({ length: 6 }, () =>
    `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(
      Math.random() * 256
    )}, ${Math.floor(Math.random() * 256)}, 0.8)`
  );
  randomColors3 = Array.from({ length: 6 }, () =>
    `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(
      Math.random() * 256
    )}, ${Math.floor(Math.random() * 256)}, 0.8)`
  );


  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.triggerFunctions();
  }

  ngAfterViewInit() {
    this.createChartUsers();
    this.createChartMatches();
    this.createChartMessages();
  }

  triggerFunctions(): void {
    this.getUsersCount();
    this.getMessagesCount();
    this.getMatchesCount();
  }

  createChartUsers() {
    this.chartUsers = new Chart('chartUsers', {
      type: 'bar',
      data: {
        labels: ["Last day", "Last 7 days", "Last month", "Last 3 months", "Last 6 months", "Last year"],
        datasets: [
          {
            label: 'Users Registered',
            data: this.users,
            backgroundColor: this.randomColors1,
          },
        ],
      },
      options: {
        aspectRatio: 2.2,
        maintainAspectRatio: false,
        scales: {
          x: {
            beginAtZero: true,
            ticks: {
              color: '#ddd'
            }
          },
          y: {
            beginAtZero: true,
            ticks: {
              color: '#ddd',
            }
          }
        },
        plugins: {
          legend: {
            labels: {
              color: '#ddd'
            }
          },
          title: {
            display: true,
            text: 'DatingHub Users',
            color: 'white'
          }
        }
      }
    });
  }
  createChartMatches() {
    this.chartMatches = new Chart('chartMatches', {
      type: 'bar',
      data: {
        labels: ["Last day", "Last 7 days", "Last month", "Last 3 months", "Last 6 months", "Last year"],
        datasets: [
          {
            label: 'Matches',
            data: this.matches,
            backgroundColor: this.randomColors2,
          }
        ],
      },
      options: {
        aspectRatio: 2.2,
        maintainAspectRatio: false,
        scales: {
          x: {
            beginAtZero: true,
            ticks: {
              color: '#ddd'
            }
          },
          y: {
            beginAtZero: true,
            ticks: {
              color: '#ddd',
            }
          }
        },
        plugins: {
          legend: {
            labels: {
              color: '#ddd'
            }
          },
          title: {
            display: true,
            text: 'DatingHub Matches',
            color: 'white'
          }
        }
      }
    });
  }
  createChartMessages() {
    this.chartMessages = new Chart('chartMessages', {
      type: 'bar',
      data: {
        labels: ["Last day", "Last 7 days", "Last month", "Last 3 months", "Last 6 months", "Last year"],
        datasets: [
          {
            label: 'Messages',
            data: this.messages,
            backgroundColor: this.randomColors3,
          }
        ],
      },
      options: {
        aspectRatio: 2.2,
        scales: {
          x: {
            beginAtZero: true,
            ticks: {
              color: '#ddd'
            }
          },
          y: {
            beginAtZero: true,
            ticks: {
              color: '#ddd',
            }
          }
        },
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: '#ddd'
            }
          },
          title: {
            display: true,
            text: 'DatingHub Messages',
            color: 'white'
          }
        }
      }
    });
  }

  getUsersCount(): void {
    this.adminService.getUsersCount().subscribe({
      next: (response: UsersCount) => {
        const responseArray: number[] = Object.values(response);
        this.users = responseArray;
        this.chartUsers.data.datasets[0].data = this.users;
        this.chartUsers.update();
      }
    });
  };

  getMatchesCount(): void {
    this.adminService.getMatchesCount().subscribe({
      next: (response: MatchesCount) => {
        const responseArray: number[] = Object.values(response);
        this.matches = responseArray;
        this.chartMatches.data.datasets[0].data = this.matches;
        this.chartMatches.update();
      }
    });
  };

  getMessagesCount(): void {
    this.adminService.getMessagesCount().subscribe({
      next: (response: MessagesCount) => {
        const responseArray: number[] = Object.values(response);
        this.messages = responseArray;
        this.chartMessages.data.datasets[0].data = this.messages;
        this.chartMessages.update();
      }
    });
  };
}
