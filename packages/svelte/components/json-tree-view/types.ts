export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue }

export type JsonTreeType = 'object' | 'array' | 'string' | 'number' | 'boolean' | 'null'
