import type { InvestigationField } from '../domain/structured-investigation.ts';

/** Native radio/checkbox groups give the same bounded answer on all inputs. */
export function mountInvestigationField<Id extends string>(parent: HTMLElement, field: InvestigationField<Id>, change: (values: readonly string[]) => void, prefix: string) {
  const group = document.createElement('fieldset'); group.className = 'investigation-field'; group.dataset['field'] = field.id;
  const legend = document.createElement('legend'); legend.textContent = field.question; group.append(legend);
  const controls = field.options.map(option => {
    const label = document.createElement('label'); label.className = 'investigation-option';
    const input = document.createElement('input'); input.type = field.mode === 'multi' ? 'checkbox' : 'radio';
    input.name = `${prefix}-${field.id}`; input.id = `${prefix}-${field.id}-${option.id}`; input.value = option.id;
    const text = document.createElement('span'); text.textContent = option.label;
    label.append(input,text); group.append(label);
    input.addEventListener('change', () => change(controls.filter(c => c.checked).map(c => c.value)));
    return input;
  });
  const clear = document.createElement('button'); clear.type = 'button'; clear.textContent = 'Auswahl in diesem Feld leeren';
  clear.addEventListener('click', () => change([])); group.append(clear); parent.append(group);
  return Object.freeze({ element: group, refresh: (values: readonly string[]) => { controls.forEach(input => { input.checked = values.includes(input.value); }); } });
}
