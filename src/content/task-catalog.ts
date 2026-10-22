import { createTaskRegistry } from '../domain/catalog.ts';
import { catalogData } from './catalog-data.ts';

/** Prepared public metadata only; the informational start page does not load it. */
export const taskRegistry = createTaskRegistry(catalogData);
