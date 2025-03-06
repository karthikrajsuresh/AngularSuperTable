import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface TableData {
  [key: string]: any;
}

@Component({
  selector: 'app-table-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './table-header.component.html',
  styleUrls: ['./table-header.component.css'],
})
export class TableHeaderComponent {
  @Input() data: TableData[] = [];
  @Output() filterSortChange = new EventEmitter<TableData[]>();

  sortKey: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  // Change to column-specific filters
  filters: { [key: string]: string } = {};

  getObjectKeys(obj: any): string[] {
    return Object.keys(obj || {});
  }

  onSort(key: string): void {
    if (this.sortKey === key) {
      // Toggle sort direction.
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = key;
      this.sortDirection = 'asc';
    }
    this.applyFilterAndSort();
  }

  // New method for column-specific filtering
  onColumnFilter(key: string): void {
    this.applyFilterAndSort();
  }

  applyFilterAndSort(): void {
    let filteredData = [...this.data];

    // Apply column-specific filters
    if (Object.keys(this.filters).length > 0) {
      filteredData = filteredData.filter((item) => {
        return Object.keys(this.filters).every((key) => {
          if (!this.filters[key]) return true; // Skip empty filters
          const value = item[key];
          if (value === null || value === undefined) return false;
          return value
            .toString()
            .toLowerCase()
            .includes(this.filters[key].toLowerCase());
        });
      });
    }

    // Apply sorting
    if (this.sortKey) {
      filteredData.sort((a, b) => {
        if (a[this.sortKey] < b[this.sortKey]) {
          return this.sortDirection === 'asc' ? -1 : 1;
        } else if (a[this.sortKey] > b[this.sortKey]) {
          return this.sortDirection === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    this.filterSortChange.emit(filteredData);
  }
}
