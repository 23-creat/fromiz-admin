interface SaveButtonProps {
  loading: boolean;
}

export function SaveButton({ loading }: SaveButtonProps) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="bg-gray-900 text-white font-light py-3 px-8 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {loading ? 'Sauvegarde...' : 'Sauvegarder'}
    </button>
  );
}
