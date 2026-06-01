import { type CurriculumResource, normalizeCurriculumResourceRow } from '@/lib/curriculum';

export type NotebookEntry = {
  id: string;
  resourceId: string;
  noteText: string;
  createdAt: string;
  updatedAt: string;
};

export type NotebookEntryWithResource = NotebookEntry & {
  resource: CurriculumResource;
};

export function normalizeNotebookEntryRow(row: Record<string, unknown>): NotebookEntry {
  return {
    id: String(row.id),
    resourceId: String(row.resource_id),
    noteText: row.note_text ? String(row.note_text) : '',
    createdAt: row.created_at ? String(row.created_at) : '',
    updatedAt: row.updated_at ? String(row.updated_at) : '',
  };
}

export function normalizeNotebookEntryWithResourceRow(
  row: Record<string, unknown>
): NotebookEntryWithResource | null {
  const note = normalizeNotebookEntryRow(row);
  const resourceRow = row.curriculum_resources as Record<string, unknown> | undefined;

  if (!resourceRow) {
    return null;
  }

  return {
    ...note,
    resource: normalizeCurriculumResourceRow(resourceRow),
  };
}
