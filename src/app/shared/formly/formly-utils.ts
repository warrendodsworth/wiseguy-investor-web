import { FormlyFieldConfig } from '@ngx-formly/core';

/**
 * Recursive formly find field in a nested field tree
 *
 * @param key field name e.g. mateActive
 * @param field formly object
 * @returns FormlyFieldConfig object
 */
export function findField(key: string, field: FormlyFieldConfig): FormlyFieldConfig {
  if (field.key == key) {
    return field;
  }
  if (!field.fieldGroup) return null;

  const result = field.fieldGroup
    .map(f => {
      const _f = findField(key, f);

      if (_f) {
        // console.log('Key', _f.key);
        return _f;
      }
      return null;
    })
    .filter(v => !!v)
    .flat();

  // The node has not been found and we have no more options
  return result[0];
}
