export interface SchemaTreeViewProps {
  /**
   * The name of the repository.
   */
  repository: string;
}

/**
 * A UI tree component to display the services' schemas in the repository
 *
 * @param props - The props for this component.
 * @returns A UI tree component to display the services' schemas in the repository
 */
export function SchemaTreeView({ repository }: SchemaTreeViewProps) {
  return (
    <div>
      <h1 className="text-[color:var(--vscode-activityBar-foreground)]">
        Welcome to {repository}!
      </h1>
    </div>
  );
}

export default SchemaTreeView;
