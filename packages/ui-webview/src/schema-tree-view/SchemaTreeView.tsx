export interface SchemaTreeViewProps {
  /**
   * The name of the repository.
   */
  repository: string;
}

export function SchemaTreeView({ repository }: SchemaTreeViewProps) {
  return (
    <div>
      <h1>Welcome to {repository}!</h1>
    </div>
  );
}

export default SchemaTreeView;
