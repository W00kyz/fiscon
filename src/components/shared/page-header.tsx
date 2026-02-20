type PageHeaderProps = {
  readonly title: string
  readonly description?: string
  readonly children?: React.ReactNode
}

export const PageHeader = ({ title, description, children }: PageHeaderProps) => (
  <div className="mb-6 flex items-center justify-between">
    <div>
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      {description && (
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      )}
    </div>
    {children && <div className="flex items-center gap-2">{children}</div>}
  </div>
)
