interface SectionCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export function SectionCard({ title, description, children }: SectionCardProps) {
  return (
    <div className="border-b border-gray-200 pb-8 mb-8">
      <div className="mb-6">
        <h2 className="text-lg font-light text-gray-900 mb-2">
          {title}
        </h2>
        <p className="text-sm text-gray-500">
          {description}
        </p>
      </div>
      {children}
    </div>
  );
}
