import { Component } from '@angular/core';
import { ChartConfiguration, ChartOptions, ChartType } from 'chart.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'ng2-charts-demo';

  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: this.generateXAxisLabels(57),
    datasets: [
      {
        data: [57000, 54000, 50000, 45000, 35000, 25000, 20000],
        label: 'Account A',
        fill: true, // This ensures that the area below the line is filled
        backgroundColor: 'rgba(255,0,0,0.3)',
      },
      {
        data: [59000, 56000, 52000, 47000, 37000, 27000, 22000],
        label: 'Account B',
        fill: '-1', // This fills the area between this line and the line of Account A
        backgroundColor: 'rgba(0,255,0,0.3)',
      },
      {
        data: [61000, 56000, 48000, 43000, 33000, 23000, 18000],
        label: 'Account C',
        fill: '-1', // This fills the area between this line and the line of Account B
        backgroundColor: 'rgba(0,0,255,0.3)',
      },

      // { data: [18000, 23000, 34000, 43000], label: 'Account B' },
      // Add more accounts as needed
    ].sort((a, b) => b.data[0] - a.data[0]), // Sort based on the first data value of each account
  };

  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    scales: {
      x: {
        grid: {
          display: false, // Turn off default vertical grid lines
        },
        ticks: {
          stepSize: 5,
        },
      },
      y: {
        grid: {
          display: false, // Turn off default horizontal grid lines
        },
      },
    },
    plugins: {
      tooltip: {
        intersect: false, // This ensures the tooltip appears based on the nearest x-axis value, not only on data point hover
        mode: 'index',
        callbacks: {
          title: (context) => {
            return 'Age ' + context[0].label;
          },
          label: (context) => {
            const accountName = context.dataset.label;
            const amount = context.parsed.y;
            return accountName + ': $' + amount;
          },
        },
      },
    },
  };

  public lineChartLegend = true;
  lineChartPlugins = [
    {
      id: 'customVerticalLine',
      afterDraw: (chart: any, options: any) => {
        const ctx = chart.ctx;
        const tooltip = chart.tooltip;
        const yAxis = chart.scales['y'];

        if (
          tooltip?.opacity === 0 ||
          !tooltip?.dataPoints ||
          tooltip?.dataPoints.length === 0
        ) {
          return; // Tooltip isn't active or no data points
        }

        // Position of vertical line
        const x = tooltip?.caretX;
        const yStart = tooltip?.caretY;

        ctx.save(); // Save current drawing state

        ctx.beginPath();
        ctx.moveTo(x, yStart);
        ctx.lineTo(x, yAxis.bottom);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.restore(); // Restore drawing state
      },
    },
  ];

  generateXAxisLabels(startAge: number): string[] {
    const labels = [];
    let age = startAge;

    while (age <= 100) {
      labels.push(age.toString());
      if (age % 5 === 0) {
        age += 5;
      } else {
        age = age - (age % 5) + 5; // Round up to the nearest multiple of 5
      }
      if (labels.length > 20) break; // Avoid infinite loop, adjust as needed
    }

    return labels;
  }
}
