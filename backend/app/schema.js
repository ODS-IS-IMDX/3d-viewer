// Copyright (c) 2025 NTT InfraNet
module.exports = fastify => {
  const schemas = [
    {
      $id: 'siteId',
      description: 'Site identifier',
      type: 'string',
      minLength: 8,
      maxLength: 36,
      examples: ['db1de9ed-8368-45e5-ac9f-1506b44c318e']
    },
    {
      $id: 'contentId',
      description: 'Content identifier',
      type: 'string',
      minLength: 8,
      maxLength: 36,
      examples: ['db1de9ed-8368-45e5-ac9f-1506b44c318e']
    },
    {
      $id: 'userId',
      description: 'User identifier',
      type: 'string',
      minLength: 8,
      maxLength: 36
    },
    {
      $id: 'assetId',
      description: 'Asset identifier',
      type: 'string',
      minLength: 1,
      maxLength: 36
    },
    {
      $id: 'ionAssetId',
      description: 'Cesium-ion Asset ID',
      type: 'number',
      minLength: 1
    }
  ]

  fastify && schemas.map(schema => fastify.addSchema(schema))
  return schemas
}
