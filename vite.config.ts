import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
		globals: true,
		exclude: ['**/node_modules', '**/dist', '.idea', '.git', '.cache','**/lib', '**/out'],
	},
})