import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableHeaderComponent } from '../table-header/table-header.component';
import { TableBodyComponent } from '../table-body/table-body.component';

interface TableData {
  [key: string]: any;
}

@Component({
  selector: 'app-super-table',
  standalone: true,
  imports: [CommonModule, TableHeaderComponent, TableBodyComponent],
  templateUrl: './super-table.component.html',
  styleUrls: ['./super-table.component.css'],
})
export class SuperTableComponent implements OnInit {
  data: TableData[] = [];
  originalData: TableData[] = [];
  logData: any[] = [];

  constructor() {}

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    // Fetch data from an API – using JSONPlaceholder as an example.
    fetch('https://jsonplaceholder.typicode.com/todos')
      .then((response) => response.json())
      .then((json) => {
        this.data = json;
        // Make a deep copy for later reference if needed.
        this.originalData = JSON.parse(JSON.stringify(json));
      })
      .catch((error) => console.error('Error fetching data:', error));
  }

  // Receives filtered/sorted data from the header component.
  onFilterSortChange(filteredData: TableData[]): void {
    this.data = filteredData;
  }

  // Receives log information from the table body when a cell is updated.
  onCellUpdate(event: {
    row: TableData;
    previous: TableData;
    updated: TableData;
  }): void {
    console.log('Cell updated:', event);
    this.logData.push(event);
  }

  // Receives a new row from the table body’s add row event.
  addNewRow(newRow: TableData): void {
    this.data = [newRow, ...this.data];
    this.logData.push({ action: 'create', newRow });
  }
}
