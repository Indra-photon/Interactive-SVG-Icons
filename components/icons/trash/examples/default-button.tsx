'use client';

import { TrashIcon } from '../default';

export function DefaultDeleteButton() {
  return (
    <button className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
      <TrashIcon size={20} />
      <span>Delete</span>
    </button>
  );
}