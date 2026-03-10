interface PhaseCardProps {
  title: string,
  description: string
}

export default function PhaseCard({title, description} : PhaseCardProps) {
  return (
    <div className="rounded-lg border bg-card p-5 shadow-sm">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
