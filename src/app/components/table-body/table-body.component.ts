import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface TableData {
  [key: string]: any;
}

@Component({
  selector: 'app-table-body',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './table-body.component.html',
  styleUrls: ['./table-body.component.css'],
})
export class TableBodyComponent {
  @Input() data: TableData[] = [];
  @Output() cellUpdate = new EventEmitter<{
    row: TableData;
    previous: TableData;
    updated: TableData;
  }>();
  @Output() addRow = new EventEmitter<TableData>();

  // Track which cell is in edit mode.
  editingCell: { rowIndex: number; key: string } | null = null;
  tempValue: any;

  getObjectKeys(obj: any): string[] {
    return Object.keys(obj || {});
  }

  // Returns an input type based on the data type.
  getInputType(value: any): string {
    if (typeof value === 'boolean') {
      return 'boolean';
    } else if (typeof value === 'number') {
      return 'number';
    }
    return 'text';
  }

  // Enable edit mode on double click.
  onCellDoubleClick(rowIndex: number, key: string, value: any): void {
    this.editingCell = { rowIndex, key };
    this.tempValue = value;
  }

  // Save the updated cell.
  saveCell(rowIndex: number, key: string): void {
    if (!this.editingCell) return;

    const previous = { ...this.data[rowIndex] };
    this.data[rowIndex][key] = this.parseValue(this.tempValue, previous[key]);
    const updated = { ...this.data[rowIndex] };

    this.cellUpdate.emit({ row: this.data[rowIndex], previous, updated });
    this.editingCell = null;
  }

  cancelEdit(): void {
    this.editingCell = null;
  }

  // Convert the temporary value based on the original data type.
  parseValue(value: any, original: any): any {
    if (typeof original === 'boolean') {
      if (value === 'true') return true;
      if (value === 'false') return false;
      return null;
    } else if (typeof original === 'number') {
      return Number(value);
    }
    return value;
  }

  // Triggered when the "+" button is clicked to add a new row.
  onAddRow(): void {
    let newRow: TableData = {};
    if (this.data.length > 0) {
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
      // Fallback if no data exists.
      newRow = { id: '', title: '', completed: null };
    }
    this.addRow.emit(newRow);
  }
}
