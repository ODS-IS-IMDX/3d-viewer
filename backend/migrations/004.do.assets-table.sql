CREATE TABLE IF NOT EXISTS `assets` (
  `id` varchar(36) NOT NULL,
  `contentId` varchar(36) NOT NULL,
  `ionAssetId` bigint unsigned DEFAULT NULL,
  `ionOnComplete` json DEFAULT NULL,
  `s3ObjectKey` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `displayName` varchar(255) DEFAULT NULL,
  `status` varchar(255) NOT NULL,
  `formatType` varchar(255) NOT NULL,
  `customPosition` json DEFAULT NULL,
  `customStyle` json DEFAULT NULL,
  `linkageApp` varchar(255) NOT NULL,
  `ionType` varchar(255) NOT NULL,
  `ionSourceType` varchar(255) NOT NULL,
  `startDateTime` datetime DEFAULT NULL,
  `endDateTime` datetime DEFAULT NULL,
  `cesiumOptions` json DEFAULT NULL,
  `createdBy` varchar(45) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedBy` varchar(45) NOT NULL,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `idx_assets_contentId` (`contentId`),
  INDEX `idx_assets_ionAssetId` (`ionAssetId`),
  INDEX `idx_assets_s3ObjectKey` (`s3ObjectKey`),
  INDEX `idx_assets_name` (`name`),
  INDEX `idx_assets_status` (`status`),
  INDEX `idx_assets_formatType` (`formatType`),
  INDEX `idx_assets_linkageApp` (`linkageApp`),
  INDEX `idx_assets_createdBy` (`createdBy`),
  INDEX `idx_assets_updatedBy` (`updatedBy`),
  INDEX `idx_assets_deleteAt` (`deletedAt` DESC),
  CONSTRAINT `fk_assets_contents`
    FOREIGN KEY (`contentId`)
    REFERENCES `contents` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE = InnoDB
;
