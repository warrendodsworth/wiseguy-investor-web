import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FieldType } from '@ngx-formly/core';
import { QuillModule } from 'ngx-quill';

@Component({
  selector: 'app-formly-field-rich-editor',
  imports: [CommonModule, ReactiveFormsModule, QuillModule],
  template: `
    @if (props.label) {
    <label class="form-label block mb-2" [for]="props['id'] ?? id">{{ props.label }}</label>
    }
    <quill-editor
      [formControl]="$any(formControl)"
      [modules]="props['modules']"
      [placeholder]="props.placeholder ?? ''"
      [readOnly]="props.readonly ?? false"
      [style]="props['style']"
      [class]="props['className']"
      [id]="props['id'] ?? id"
    ></quill-editor>
  `,
  // changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      quill-editor {
        max-width: 600px;
      }
      .ql-editor {
        min-height: 200px;
      }
    `,
  ],
})
export class FormlyFieldRichEditor extends FieldType {}
