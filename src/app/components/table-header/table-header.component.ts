import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-table-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './table-header.component.html',
  styleUrls: ['./table-header.component.css'],
})
export class TableHeaderComponent {
  @Input() data: any[] = [];
  @Output() filterSortChange = new EventEmitter<any[]>();

  sortKey: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  filters: { [key: string]: string } = {};

  getObjectKeys(obj: any): string[] {
    return Object.keys(obj).sort();
  }

  onSort(key: string): void {
    if (this.sortKey === key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = key;
      this.sortDirection = 'asc';
    }
    this.applyFilterAndSort();
  }

  onColumnFilter(key: string): void {
    this.applyFilterAndSort();
  }

  applyFilterAndSort(): void {
    let filteredData = [...this.data];
    Object.keys(this.filters).forEach((key) => {
      const filterValue = this.filters[key];
      if (filterValue) {
        filteredData = filteredData.filter(
          (item) =>
            item[key] &&
            item[key]
              .toString()
              .toLowerCase()
              .includes(filterValue.toLowerCase())
        );
      }
    });
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
