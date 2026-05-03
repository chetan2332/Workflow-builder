import type { TypeSchema, DataType } from '@n8n-project/shared';

/**
 * Props for SchemaBuilder component
 *
 * Why these props?
 * - schema: The current schema state (what to display)
 * - onChange: Callback when schema changes (parent manages state)
 * - label: What to call this schema (e.g., "Input Schema", "Response Type")
 * - showRequired: Whether to show required checkbox (for object properties)
 * - level: Nesting level (for indentation in nested schemas)
 */
interface SchemaBuilderProps {
  schema: TypeSchema;
  onChange: (schema: TypeSchema) => void;
  label?: string;
  showRequired?: boolean;
  level?: number;
}

const TYPE_OPTIONS: { value: DataType; label: string }[] = [
  { value: 'any', label: 'Any (no validation)' },
  { value: 'string', label: 'String' },
  { value: 'number', label: 'Number' },
  { value: 'boolean', label: 'Boolean' },
  { value: 'object', label: 'Object (nested)' },
  { value: 'array', label: 'Array' },
];

/**
 * Recursive schema editor component
 *
 * HOW IT WORKS:
 * 1. Shows type selector dropdown
 * 2. If type is 'array', shows nested SchemaBuilder for items (recursion!)
 * 3. If type is 'object', shows list of properties (each has SchemaBuilder - recursion!)
 * 4. If type is primitive, just shows type selector
 *
 * WHY RECURSIVE?
 * - Schemas are recursive (can nest infinitely)
 * - UI must match data structure
 * - One component handles all nesting levels
 */
export function SchemaBuilder({
  schema,
  onChange,
  label,
  showRequired = false,
  level = 0,
}: SchemaBuilderProps) {
  /**
   * Handle type change
   *
   * Why clear itemType/properties?
   * - Different types have different shape
   * - Changing from object to string? Properties no longer relevant
   * - Changing from array to number? itemType no longer relevant
   */
  const handleTypeChange = (newType: DataType) => {
    const updated: TypeSchema = { type: newType };

    // Preserve required flag if it existed
    if (schema.required !== undefined) {
      updated.required = schema.required;
    }

    // Initialize nested structures based on new type
    if (newType === 'array') {
      updated.itemType = { type: 'any' }; // Default: array of any
    } else if (newType === 'object') {
      updated.properties = []; // Empty object initially
    }

    onChange(updated);
  };

  return (
    <div style={{ marginLeft: level * 20, marginBottom: 12 }}>
      {/* Header row: type selector + required checkbox */}
      <div className="flex items-center gap-2 mb-2">
        {label && (
          <label className="text-sm font-medium text-slate-200">{label}</label>
        )}

        {/* Type dropdown */}
        <select
          value={schema.type}
          onChange={(e) => handleTypeChange(e.target.value as DataType)}
          className="input w-48 text-sm"
        >
          {TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Required checkbox (for object properties) */}
        {showRequired && (
          <label className="flex items-center gap-1 text-sm text-slate-300">
            <input
              type="checkbox"
              checked={schema.required || false}
              onChange={(e) =>
                onChange({ ...schema, required: e.target.checked })
              }
              className="rounded"
            />
            Required
          </label>
        )}
      </div>

      {/* ARRAY TYPE: Show item type editor */}
      {schema.type === 'array' && (
        <div className="border-l-2 border-slate-600 pl-4 ml-2 mt-2">
          <div className="text-xs text-slate-400 mb-1">Array items:</div>
          {/* RECURSION: SchemaBuilder editing itemType */}
          <SchemaBuilder
            schema={schema.itemType || { type: 'any' }}
            onChange={(itemType) => onChange({ ...schema, itemType })}
            showRequired={false}
            level={level + 1}
          />
        </div>
      )}

      {/* OBJECT TYPE: Show properties editor */}
      {schema.type === 'object' && (
        <div className="border-l-2 border-slate-600 pl-4 ml-2 mt-2">
          <div className="text-xs text-slate-400 mb-2">Properties:</div>

          {/* List of properties */}
          {schema.properties?.map((prop, index) => (
            <div
              key={index}
              className="mb-3 border-b border-slate-700 pb-2"
            >
              {/* Property name input */}
              <div className="flex items-center gap-2 mb-1">
                <input
                  type="text"
                  value={prop.name}
                  onChange={(e) => {
                    const newProps = [...(schema.properties || [])];
                    newProps[index] = { ...prop, name: e.target.value };
                    onChange({ ...schema, properties: newProps });
                  }}
                  placeholder="Property name"
                  className="input text-sm flex-1"
                />

                {/* Remove property button */}
                <button
                  onClick={() => {
                    const newProps = schema.properties?.filter(
                      (_, i) => i !== index,
                    );
                    onChange({ ...schema, properties: newProps });
                  }}
                  className="btn-ghost text-red-400 hover:text-red-300 px-2 py-1 text-sm"
                  type="button"
                >
                  ×
                </button>
              </div>

              {/* RECURSION: SchemaBuilder for property's schema */}
              <SchemaBuilder
                schema={prop.schema}
                onChange={(propSchema) => {
                  const newProps = [...(schema.properties || [])];
                  newProps[index] = { ...prop, schema: propSchema };
                  onChange({ ...schema, properties: newProps });
                }}
                showRequired={true} // Properties can be required
                level={level + 1}
              />
            </div>
          ))}

          {/* Add property button */}
          <button
            onClick={() => {
              const newProps = [
                ...(schema.properties || []),
                { name: '', schema: { type: 'any' as DataType } },
              ];
              onChange({ ...schema, properties: newProps });
            }}
            className="btn-ghost text-sm px-2 py-1"
            type="button"
          >
            + Add Property
          </button>
        </div>
      )}
    </div>
  );
}
