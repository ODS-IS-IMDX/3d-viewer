CREATE TABLE IF NOT EXISTS `users` (
  `id` varchar(45) NOT NULL,
  `loginUserId` varchar(45) NOT NULL,
  `corporationId` varchar(36) DEFAULT NULL,
  `licenseItemIdList` json DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `firstName` varchar(45) NOT NULL,
  `lastName` varchar(45) NOT NULL,
  `title` varchar(45) DEFAULT NULL,
  `phone` varchar(45) DEFAULT NULL,
  `company` varchar(255) DEFAULT NULL,
  `timezone` varchar(100) DEFAULT NULL,
  `language` varchar(2) NOT NULL DEFAULT 'en',
  `disabled` tinyint NOT NULL DEFAULT 0,
  `firstLogin` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `idx_users_loginUserId` (`loginUserId`),
  INDEX `idx_users_corporationId` (`corporationId`),
  CONSTRAINT `fk_users_corporations`
    FOREIGN KEY (`corporationId`)
    REFERENCES `corporations` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE = InnoDB
;
