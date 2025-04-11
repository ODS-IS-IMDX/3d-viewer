ALTER TABLE `external_service_authentication` DROP CONSTRAINT `fk_esa_contents`;
ALTER TABLE `external_service_authentication` DROP CONSTRAINT `fk_esa_corporations`;
ALTER TABLE `external_service_authentication` DROP CONSTRAINT `fk_esa_users`;

DROP INDEX `idx_esa_contentId` ON `external_service_authentication`;
DROP INDEX `idx_esa_corporationId` ON `external_service_authentication`;
DROP INDEX `idx_esa_userId` ON `external_service_authentication`;
DROP INDEX `idx_esa_type` ON `external_service_authentication`;
DROP INDEX `idx_esa_status` ON `external_service_authentication`;
DROP INDEX `idx_esa_createdBy` ON `external_service_authentication`;
DROP INDEX `idx_esa_updatedBy` ON `external_service_authentication`;
DROP INDEX `idx_esa_deletedAt` ON `external_service_authentication`;

ALTER TABLE `external_service_authentication` DROP COLUMN `contentId`;
ALTER TABLE `external_service_authentication` DROP COLUMN `corporationId`;
ALTER TABLE `external_service_authentication` DROP COLUMN `userId`;
ALTER TABLE `external_service_authentication` DROP COLUMN `type`;
ALTER TABLE `external_service_authentication` DROP COLUMN `status`;
ALTER TABLE `external_service_authentication` DROP COLUMN `createdBy`;
ALTER TABLE `external_service_authentication` DROP COLUMN `updatedBy`;
ALTER TABLE `external_service_authentication` DROP COLUMN `deletedAt`;

INSERT INTO `external_service_authentication` (`id`) VALUES ('00000000-0000-0000-0000-000000000000');
