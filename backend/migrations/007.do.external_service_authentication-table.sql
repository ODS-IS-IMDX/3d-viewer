CREATE TABLE IF NOT EXISTS `external_service_authentication` (
  `id` VARCHAR(36) NOT NULL,
  `contentId` VARCHAR(36) NOT NULL,
  `corporationId` VARCHAR(36) NOT NULL,
  `userId` VARCHAR(45) NOT NULL,
  `type` VARCHAR(255) NOT NULL,
  `status` VARCHAR(255) NOT NULL,
  `authentication` JSON DEFAULT NULL,
  `createdBy` VARCHAR(45) NOT NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedBy` VARCHAR(45) NOT NULL,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deletedAt` DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `idx_esa_contentId` (`contentId`),
  INDEX `idx_esa_corporationId` (`corporationId`),
  INDEX `idx_esa_userId` (`userId`),
  INDEX `idx_esa_type` (`type`),
  INDEX `idx_esa_status` (`status`),
  INDEX `idx_esa_createdBy` (`createdBy`),
  INDEX `idx_esa_updatedBy` (`updatedBy`),
  INDEX `idx_esa_deletedAt` (`deletedAt` DESC),
  CONSTRAINT `fk_esa_contents`
    FOREIGN KEY (`contentId`)
    REFERENCES `contents` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_esa_corporations`
    FOREIGN KEY (`corporationId`)
    REFERENCES `corporations` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_esa_users`
    FOREIGN KEY (`userId`)
    REFERENCES `users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE = InnoDB
;
