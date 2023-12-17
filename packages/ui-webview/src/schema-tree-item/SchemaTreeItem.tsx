export interface SchemaTreeItemProps {
  /**
   * The name of the service.
   */
  service: string;
}

export function SchemaTreeItem({ service }: SchemaTreeItemProps) {
  return (
    <div>
      <h1>Welcome to {service}!</h1>
    </div>
  );
}

export default SchemaTreeItem;
