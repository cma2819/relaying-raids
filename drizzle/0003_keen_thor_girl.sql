PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_relayEvents` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`moderator` text NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_relayEvents`("id", "moderator", "name", "slug") SELECT "id", "moderator", "name", "slug" FROM `relayEvents`;--> statement-breakpoint
DROP TABLE `relayEvents`;--> statement-breakpoint
ALTER TABLE `__new_relayEvents` RENAME TO `relayEvents`;--> statement-breakpoint
PRAGMA foreign_keys=ON;