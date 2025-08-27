CREATE TABLE `relayCursors` (
	`eventId` integer PRIMARY KEY NOT NULL,
	`currentSubmissionId` integer NOT NULL,
	`raidedAt` integer,
	FOREIGN KEY (`eventId`) REFERENCES `relayEvents`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`currentSubmissionId`) REFERENCES `relaySubmissions`(`id`) ON UPDATE no action ON DELETE cascade
);
