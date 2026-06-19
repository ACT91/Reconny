export function TechnologyBadges({ technologies }: { technologies?: string[] }) {
  if (!technologies || technologies.length === 0) return <span className="text-neutral-600 text-xs">—</span>

  return (
    <div className="flex flex-wrap gap-1">
      {technologies.slice(0, 4).map((tech) => (
        <span
          key={tech}
          className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-neutral-800 text-neutral-300"
        >
          {tech}
        </span>
      ))}
      {technologies.length > 4 && (
        <span className="text-xs text-neutral-500">+{technologies.length - 4}</span>
      )}
    </div>
  )
}