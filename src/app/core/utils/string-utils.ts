/**
 * Utilidades para manipulación de strings
 * Usadas principalmente en la generación de código
 */

/**
 * Capitaliza la primera letra de un string
 * @example capitalize('user') => 'User'
 */
export function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Convierte un string a camelCase
 * @example toCamelCase('user_name') => 'userName'
 * @example toCamelCase('UserName') => 'userName'
 */
export function toCamelCase(str: string): string {
  if (!str) return '';

  // Reemplaza guiones bajos y guiones con espacios
  const cleaned = str.replace(/[-_]/g, ' ');

  // Split por espacios y capitaliza cada palabra excepto la primera
  const words = cleaned.split(' ').filter(w => w.length > 0);

  if (words.length === 0) return '';

  return words[0].toLowerCase() +
         words.slice(1).map(w => capitalize(w)).join('');
}

/**
 * Convierte un string a PascalCase
 * @example toPascalCase('user_name') => 'UserName'
 */
export function toPascalCase(str: string): string {
  if (!str) return '';
  const camel = toCamelCase(str);
  return capitalize(camel);
}

/**
 * Genera indentación (espacios) para código
 * @param level - Nivel de indentación (default: 1)
 * @param spaces - Espacios por nivel (default: 2)
 */
export function indent(level: number = 1, spaces: number = 2): string {
  return ' '.repeat(level * spaces);
}

/**
 * Sanitiza un nombre de campo para que sea válido en TypeScript
 * @example sanitizeFieldName('user-name') => 'userName'
 */
export function sanitizeFieldName(name: string): string {
  return toCamelCase(name.trim());
}
