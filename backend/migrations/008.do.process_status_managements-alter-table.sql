CREATE TABLE IF NOT EXISTS `processing_status_managements` (
  `id` VARCHAR(36) NOT NULL,
  `processingType` VARCHAR(255) NOT NULL,
  `resourceCategory` VARCHAR(255) NOT NULL,
  `resourceValue` VARCHAR(255) NOT NULL,
  `identityNumber` INT UNSIGNED NOT NULL,
  `status` VARCHAR(255) NOT NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_psm` (`processingType`, `resourceCategory`, `resourceValue`, `identityNumber`),
  INDEX `idx_psm_processingType` (`processingType`),
  INDEX `idx_psm_resourceCategory` (`resourceCategory`),
  INDEX `idx_psm_resourceValue` (`resourceValue`),
  INDEX `idx_psm_identityNumber` (`identityNumber`),
  INDEX `idx_psm_status` (`status`)
) ENGINE = InnoDB
;
