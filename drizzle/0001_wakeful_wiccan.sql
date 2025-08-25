CREATE TABLE `relaySubmissions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`eventId` integer NOT NULL,
	`name` text NOT NULL,
	`twitch` text NOT NULL,
	FOREIGN KEY (`eventId`) REFERENCES `relayEvents`(`id`) ON UPDATE no action ON DELETE cascade
);
