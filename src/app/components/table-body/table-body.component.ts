import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-table-body',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './table-body.component.html',
  styleUrls: ['./table-body.component.css'],
})
export class TableBodyComponent {
  @Input() data: any[] = [];
  @Output() cellUpdate = new EventEmitter<{
    row: any;
    previous: any;
    updated: any;
  }>();

  // Stores which cell is in edit mode.
  editingCell: { rowIndex: number; key: string } | null = null;
  // Holds the temporary value while editing.
  tempValue: any;

  getObjectKeys(obj: any): string[] {
    return Object.keys(obj).sort(); // Sort keys alphabetically
  }

  // Determines the input type based on the current value.
  getInputType(value: any): string {
    if (typeof value === 'boolean') {
      return 'boolean';
    } else if (typeof value === 'number') {
      return 'number';
    }
    return 'text';
  }

  // Triggered on double-click of a table cell.
  onCellDoubleClick(rowIndex: number, key: string, value: any): void {
    console.log('Double clicked cell:', rowIndex, key, value);
    this.editingCell = { rowIndex, key };
    // Initialize tempValue with the cell's current value.
    this.tempValue = value;
  }

  // Save the cell value and emit an update event.
  saveCell(rowIndex: number, key: string): void {
    if (!this.editingCell) return;
    console.log(
      'Saving cell at row:',
      rowIndex,
      'key:',
      key,
      'new value:',
      this.tempValue
    );
    const previous = { ...this.data[rowIndex] };
    // Convert the temporary value if needed.
    this.data[rowIndex][key] = this.parseValue(this.tempValue, previous[key]);
    const updated = { ...this.data[rowIndex] };
    console.log('Cell updated. Previous:', previous, 'Updated:', updated);
    this.cellUpdate.emit({ row: this.data[rowIndex], previous, updated });
    // Exit editing mode.
    this.editingCell = null;
  }

  // Cancel the editing mode.
  cancelEdit(): void {
    console.log('Editing cancelled.');
    this.editingCell = null;
  }

  // Parses the temporary value to match the type of the original value.
  parseValue(value: any, original: any): any {
    if (typeof original === 'boolean') {
      if (value === 'true' || value === true) return true;
      if (value === 'false' || value === false) return false;
      return null;
    } else if (typeof original === 'number') {
      const num = Number(value);
      return isNaN(num) ? original : num;
    }
    return value;
  }
}
