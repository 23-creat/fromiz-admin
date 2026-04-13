export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      <div className="text-sm text-gray-500 font-light">
        Chargement...
      </div>
    </div>
  );
}
