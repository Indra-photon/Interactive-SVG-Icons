'use client';

import { TrashIconBounce } from '../bounce';

export function BounceDeleteButton() {
  return (
    <button className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
      <TrashIconBounce size={20} />
      <span>Delete</span>
    </button>
  );
}