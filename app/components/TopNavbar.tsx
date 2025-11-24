'use client';

interface TopNavbarProps {
  zoom: number;
  onZoomChange: (zoom: number) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onExport: () => void;
  onNew: () => void;
}

export default function TopNavbar({
  zoom,
  onZoomChange,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onExport,
  onNew,
}: TopNavbarProps) {
  return (
    <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm z-10">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold text-gray-800">Resume & Invoice Editor</h1>
        <div className="h-6 w-px bg-gray-300" />
        <button
          onClick={onNew}
          className="px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          New
        </button>
        <button className="px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
          Open
        </button>
        <button className="px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
          Save
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-1">
          <button
            onClick={() => onZoomChange(Math.max(25, zoom - 25))}
            className="p-1 hover:bg-gray-200 rounded transition-colors"
            disabled={zoom <= 25}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          <span className="text-sm font-medium text-gray-700 min-w-[60px] text-center">
            {zoom}%
          </span>
          <button
            onClick={() => onZoomChange(Math.min(200, zoom + 25))}
            className="p-1 hover:bg-gray-200 rounded transition-colors"
            disabled={zoom >= 200}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
          <button
            onClick={() => onZoomChange(100)}
            className="px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-200 rounded transition-colors"
          >
            Fit
          </button>
        </div>

        <div className="h-6 w-px bg-gray-300" />

        <button
          onClick={onUndo}
          disabled={!canUndo}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Undo"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
          </svg>
        </button>
        <button
          onClick={onRedo}
          disabled={!canRedo}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Redo"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
          </svg>
        </button>

        <div className="h-6 w-px bg-gray-300" />

        <div className="relative">
          <button
            onClick={() => onExport()}
            className="px-4 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2"
          >
            📥 Download PDF
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

