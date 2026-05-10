CREATE TABLE `completedEvents` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`eventId` integer NOT NULL,
	`completedAt` integer NOT NULL,
	FOREIGN KEY (`eventId`) REFERENCES `relayEvents`(`id`) ON UPDATE no action ON DELETE cascade
);