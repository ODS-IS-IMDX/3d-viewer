CREATE TABLE IF NOT EXISTS `contents_resource_owners` (
  `contentId` VARCHAR(36) NOT NULL,
  `contentCategory` VARCHAR(255) NOT NULL,
  `resourceOwnerId` VARCHAR(255) NOT NULL,
  `fileStorageBucketId` VARCHAR(255) DEFAULT NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deletedAt` DATETIME DEFAULT NULL,
  PRIMARY KEY (`contentId`, `contentCategory`),
  INDEX `idx_reports_resourceOwnerId` (`resourceOwnerId`),
  INDEX `idx_reports_contentId` (`contentId`),
  INDEX `idx_cro_fileStorageBucketId` (`fileStorageBucketId`),
  INDEX `idx_cro_contentCategory` (`contentCategory`)
) ENGINE = InnoDB
;
