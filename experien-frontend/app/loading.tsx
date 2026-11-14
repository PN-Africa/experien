export default function Loading() {
  return (
    <div role="status" aria-live="polite" className="flex min-h-[50vh] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-ink" />
        <p className="text-sm text-muted">Loading...</p>
      </div>
    </div>
  );
}