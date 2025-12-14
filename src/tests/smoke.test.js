/**
 * Smoke test - Verifica que el entorno de testing está funcionando
 */

describe('Smoke Test', () => {
  test('el entorno de testing funciona correctamente', () => {
    expect(true).toBe(true);
  });

  test('las operaciones matemáticas funcionan', () => {
    expect(2 + 2).toBe(4);
    expect(10 - 5).toBe(5);
  });
});
