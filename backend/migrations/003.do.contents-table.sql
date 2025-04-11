CREATE TABLE IF NOT EXISTS `contents` (
  `id` varchar(36) NOT NULL,
  `corporationId` varchar(36) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `attribute` json DEFAULT NULL,
  `viewStructure` json DEFAULT NULL,
  `cesiumIonTokenId` varchar(255) DEFAULT NULL,
  `cesiumIonTokenValue` varchar(511) DEFAULT NULL,
  `createdBy` varchar(45) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedBy` varchar(45) NOT NULL,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `idx_contents_corporationId` (`corporationId`),
  INDEX `idx_contents_name` (`name`),
  INDEX `idx_contents_cesiumIonTokenId` (`cesiumIonTokenId`),
  INDEX `idx_contents_createdBy` (`createdBy`),
  INDEX `idx_contents_updatedBy` (`updatedBy`),
  INDEX `idx_contents_deletedAt` (`deletedAt` DESC),
  CONSTRAINT `fk_contents_corporations`
    FOREIGN KEY (`corporationId`)
    REFERENCES `corporations` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE = InnoDB
;
