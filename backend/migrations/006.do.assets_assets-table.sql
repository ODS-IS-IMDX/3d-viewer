CREATE TABLE IF NOT EXISTS `assets_assets` (
  `id` VARCHAR(36) NOT NULL,
  `contentId` VARCHAR(36) NOT NULL,
  `assetId` VARCHAR(36) NOT NULL,
  `linkedAssetId` VARCHAR(36) NOT NULL,
  `type` VARCHAR(255) NOT NULL,
  `createdBy` VARCHAR(45) NOT NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedBy` VARCHAR(45) NOT NULL,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deletedAt` DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_aa` (`contentId`, `assetId`, `linkedAssetId`),
  INDEX `idx_aa_contentId` (`contentId`),
  INDEX `idx_aa_assetId` (`assetId`),
  INDEX `idx_aa_linkedAssetId` (`linkedAssetId`),
  INDEX `idx_aa_type` (`type`),
  INDEX `idx_aa_createdBy` (`createdBy`),
  INDEX `idx_aa_updatedBy` (`updatedBy`),
  INDEX `idx_aa_deletedAt` (`deletedAt` DESC),
  CONSTRAINT `fk_aa_contents`
    FOREIGN KEY (`contentId`)
    REFERENCES `contents` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_aa_assets`
    FOREIGN KEY (`assetId`)
    REFERENCES `assets` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_aa_linked_assets`
    FOREIGN KEY (`linkedAssetId`)
    REFERENCES `assets` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE = InnoDB
;
