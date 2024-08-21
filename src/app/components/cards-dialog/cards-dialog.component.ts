import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-dialog',
  template: `
    <nb-card>
      <nb-card-header>Cartas Extraídas</nb-card-header>
      <nb-card-body>
        <div class="card-grid">
          <div *ngFor="let card of drawnCards" class="card-item">
            <img [src]="card.image" alt="{{ card.name }}" />
            <p>{{ card.name }} - {{ card.number }}</p>
          </div>
        </div>
      </nb-card-body>
    </nb-card>
  `,
  styles: [`
    nb-card-body {
      max-height: 500px; /* Altura máxima del contenedor */
      overflow-y: auto;  /* Habilitar scroll vertical */
    }
    .card-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); /* Grilla flexible */
      grid-gap: 10px; /* Espacio entre las cartas */
    }
    .card-item {
      text-align: center;
      padding: 10px;
    }
    .card-item img {
      width: 80px;   /* Ajusta el tamaño de la imagen */
      height: 120px; /* Ajusta la altura de la imagen */
      object-fit: cover; /* Asegura que la imagen cubra completamente el área asignada */
    }
  `]
})
export class CardsDialogComponent {
  @Input() drawnCards: any[] = [];
}
