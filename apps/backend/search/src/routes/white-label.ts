import { type FastifyPluginAsync } from 'fastify';
import { type JsonSchemaToTsProvider } from '@fastify/type-provider-json-schema-to-ts';
import { type SchemaTypes } from '../plugins/schemas.js';
import { whiteLabelSettingsRepository } from '../db/white-label-settings-repository.js';
import { adminActionLogRepository } from '../db/admin-action-log-repository.js';

const whiteLabelRoutes: FastifyPluginAsync = async (_fastify, _options): Promise<void> => {
  const fastify = _fastify.withTypeProvider<
    JsonSchemaToTsProvider<{
      ValidatorSchemaOptions: { references: SchemaTypes };
      SerializerSchemaOptions: { references: SchemaTypes };
    }>
  >();

  // Get white-label settings (public endpoint)
  fastify.get('/api/white-label-settings', {
    schema: {
      description: 'Get white-label branding settings',
      tags: ['white-label'],
      response: {
        200: {
          type: 'object',
          properties: {
            logoUrl: { type: ['string', 'null'] },
            brandColor: { type: ['string', 'null'] },
            appName: { type: ['string', 'null'] },
            customCss: { type: ['string', 'null'] },
          },
        },
        500: { $ref: 'httpError' },
      },
    } as const,
    handler: async function (_request, reply) {
      try {
        const settings = whiteLabelSettingsRepository.getSettings();

        if (!settings) {
          return reply.send({
            logoUrl: null,
            brandColor: null,
            appName: null,
            customCss: null,
          });
        }

        return reply.send({
          logoUrl: settings.logo_url,
          brandColor: settings.brand_color,
          appName: settings.app_name,
          customCss: settings.custom_css,
        });
      } catch (error) {
        fastify.log.error(error);
        return reply.internalServerError('Failed to retrieve white-label settings');
      }
    },
  });

  // Update white-label settings (admin/owner only)
  fastify.put('/api/white-label-settings', {
    preHandler: [fastify.authenticate, fastify.requireAdmin],
    schema: {
      description: 'Update white-label branding settings (admin/owner only)',
      tags: ['white-label'],
      body: {
        type: 'object',
        properties: {
          logoUrl: { type: ['string', 'null'] },
          brandColor: { type: ['string', 'null'] },
          appName: { type: ['string', 'null'] },
          customCss: { type: ['string', 'null'] },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            settings: {
              type: 'object',
              properties: {
                logoUrl: { type: ['string', 'null'] },
                brandColor: { type: ['string', 'null'] },
                appName: { type: ['string', 'null'] },
                customCss: { type: ['string', 'null'] },
              },
            },
          },
        },
        401: { $ref: 'httpError' },
        403: { $ref: 'httpError' },
        500: { $ref: 'httpError' },
      },
    } as const,
    handler: async function (request, reply) {
      const { logoUrl, brandColor, appName, customCss } = request.body as {
        logoUrl?: string | null;
        brandColor?: string | null;
        appName?: string | null;
        customCss?: string | null;
      };

      try {
        const settings = whiteLabelSettingsRepository.updateSettings({
          logo_url: logoUrl,
          brand_color: brandColor,
          app_name: appName,
          custom_css: customCss,
        });

        // Log admin action
        adminActionLogRepository.createLog({
          user_id: request.user!.id,
          action: 'update_white_label_settings',
          entity_type: 'white_label_settings',
          entity_id: settings.id,
          description: `Updated white-label settings: ${Object.keys(request.body).join(', ')}`,
          meta_json: { changes: request.body },
        });

        return reply.send({
          success: true,
          settings: {
            logoUrl: settings.logo_url,
            brandColor: settings.brand_color,
            appName: settings.app_name,
            customCss: settings.custom_css,
          },
        });
      } catch (error) {
        fastify.log.error(error);
        return reply.internalServerError('Failed to update white-label settings');
      }
    },
  });

  // Reset white-label settings (owner only)
  fastify.delete('/api/white-label-settings', {
    preHandler: [fastify.authenticate, fastify.requireOwner],
    schema: {
      description: 'Reset white-label branding settings to defaults (owner only)',
      tags: ['white-label'],
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
          },
        },
        401: { $ref: 'httpError' },
        403: { $ref: 'httpError' },
        500: { $ref: 'httpError' },
      },
    } as const,
    handler: async function (request, reply) {
      try {
        whiteLabelSettingsRepository.resetSettings();

        // Log admin action
        adminActionLogRepository.createLog({
          user_id: request.user!.id,
          action: 'reset_white_label_settings',
          entity_type: 'white_label_settings',
          description: 'Reset white-label settings to defaults',
        });

        return reply.send({ success: true });
      } catch (error) {
        fastify.log.error(error);
        return reply.internalServerError('Failed to reset white-label settings');
      }
    },
  });
};

export default whiteLabelRoutes;
