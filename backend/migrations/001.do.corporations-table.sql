CREATE TABLE IF NOT EXISTS `corporations` (
  `id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `location` json DEFAULT NULL,
  `createdBy` varchar(45) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedBy` varchar(45) NOT NULL,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB
;
