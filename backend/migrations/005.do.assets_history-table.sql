CREATE TABLE IF NOT EXISTS `assets_history` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `assetId` VARCHAR(36) NOT NULL,
  `status` VARCHAR(255) NOT NULL,
  `userId` VARCHAR(45) NOT NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deletedAt` DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `idx_assets_history_assetId` (`assetId`),
  INDEX `idx_assets_history_status` (`status`),
  INDEX `idx_assets_history_userId` (`userId`)
) ENGINE = InnoDB
;
