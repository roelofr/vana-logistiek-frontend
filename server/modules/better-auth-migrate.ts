// modules/better-auth-migrate.ts
import { defineNuxtModule, logger } from '@nuxt/kit'
import { getMigrations } from 'better-auth/db/migration'
import { getAuthConfig } from '#server/lib/auth'

export default defineNuxtModule({
  meta: {
    name: 'better-auth-migrate',
  },
  setup(options, nuxt) {
    // Hook into nitro:prepare to run migration BEFORE the server builds
    nuxt.hook('modules:done', async () => {
      logger.info('🔄 Running better-auth migrations...')

      // Get config
      const auth = getAuthConfig()

      // Get migrations
      const { toBeAdded, toBeCreated, runMigrations } = await getMigrations(auth)

      // Run, if any
      if (toBeAdded.length > 0 || toBeCreated.length > 0) {
        logger.info('🚀 Running database migrations...')
        runMigrations()

        logger.info('✅ Database migrations completed successfully.')
      } else {
        logger.info('✅ No database migrations needed.')
      }
    })
  },
})
