// System
import { AfterViewInit, Component, computed, ElementRef, inject, input, ViewChild } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
// Other modules
import { LanguageService } from '@shared/services';


Chart.register(...registerables);

@Component({
  standalone: true,
  selector: 'app-doughnut-chart-component',
  imports: [TranslateModule],
  templateUrl: './doughnut-chart-component.html',
})
export class DoughnutChartComponent implements AfterViewInit { 

  // Injections
  private languageService = inject(LanguageService);

  // Properties
  translationBase = input.required<string>();
  total = input.required<number>();
  actives = input.required<number>()
  inactives = computed<number>(() => this.total() - this.actives());
  titleKey = computed<string>(() => this.translationBase() + '.TITLE');
  @ViewChild('chartNameRef') chartRef! : ElementRef<HTMLCanvasElement>;  
  private chart: Chart | null = null;
  
  // Lifecycle
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.createChart();
    }, 500);
  }
  
  // Cleanup
  ngOnDestroy(): void {
    this.chart?.destroy();
  }

  // Methods
  private createChart() {  
    
    if (!this.chartRef?.nativeElement) return;
    
    const title = this.languageService.getTranslation(this.translationBase() + '.TITLE');
    const activeLabel = this.languageService.getTranslation(this.translationBase() + '.ACTIVE');
    const inactiveLabel = this.languageService.getTranslation(this.translationBase() + '.INACTIVE');
    
    const config: ChartConfiguration = {
      type: 'doughnut',
      data: {
        /*
        labels: [
          `${activeLabel}: ${this.actives()}`,
          `${inactiveLabel}: ${this.inactives()}`
        ],
        */
        datasets: [{
          data: [
            this.actives(), 
            this.inactives()],
          backgroundColor: [
            '#00ff00', 
            '#ff0000'
          ],
          borderColor: [
            '#00fff0',
            '#ff00f0'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        /*
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: 'hsl(var(--bc))'
            }
          },
          title: {
            display: true,
            text: `${title}: ${this.total()}`,
            color: 'hsl(var(--bc))',
            font: {
              size: 16,
              weight: 'bold'
            }
          }
        }
        */
      }
    };
    // Set chart
    this.chart = new Chart(this.chartRef.nativeElement, config);
  }
  
}
