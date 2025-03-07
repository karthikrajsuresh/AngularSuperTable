import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableHeaderComponent } from '../table-header/table-header.component';
import { TableBodyComponent } from '../table-body/table-body.component';

@Component({
  selector: 'app-super-table',
  standalone: true,
  imports: [CommonModule, TableHeaderComponent, TableBodyComponent],
  templateUrl: './super-table.component.html',
  styleUrls: ['./super-table.component.css'],
})
export class SuperTableComponent implements OnInit {
  data: any[] = [];
  originalData: any[] = [];
  logData: any[] = [];

  constructor() {}

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    // Fetch sample data from an API (JSONPlaceholder)
    fetch('https://jsonplaceholder.typicode.com/comments')
      .then((response) => response.json())
      .then((json) => {
        this.data = json;
        this.originalData = JSON.parse(JSON.stringify(json));
      })
      .catch((error) => console.error('Error fetching data:', error));
  }

  onFilterSortChange(filteredData: any[]): void {
    this.data = filteredData;
  }

  onCellUpdate(event: { row: any; previous: any; updated: any }): void {
    console.log('Cell updated:', event);
    this.logData.push(event);
  }

  // Triggered when the '+' button is clicked.
  onAddRowFromSuperTable(): void {
    let newRow: any = {};
    if (this.data && this.data.length > 0) {
      Object.keys(this.data[0]).forEach((key) => {
        const type = typeof this.data[0][key];
        if (type === 'boolean') {
          newRow[key] = null;
        } else if (type === 'number') {
          newRow[key] = 0;
        } else {
          newRow[key] = '';
        }
      });
    } else {
      newRow = { id: '', title: '', completed: null };
    }
    this.addNewRow(newRow);
  }

  addNewRow(newRow: any): void {
    this.data = [newRow, ...this.data];
    this.logData.push({ action: 'create', newRow });
  }
}
