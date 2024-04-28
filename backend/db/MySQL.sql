CREATE DATABASE IF NOT EXISTS project_dashboard CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE project_dashboard;

CREATE TABLE `users` (
	`id` BINARY(16) NOT NULL,
	`name` VARCHAR(50) NOT NULL,
	`pass` VARCHAR(255) NOT NULL,
	`type` VARCHAR(60) NOT NULL,
	`creation_date` DATE NOT NULL,
	PRIMARY KEY(id)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `projects` (
	`id` BINARY(16) NOT NULL,
	`date` DATE NOT NULL,
	`title` VARCHAR(255) NOT NULL,
	`description` TEXT,
	`publicity` INTEGER NOT NULL,
	PRIMARY KEY (id)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `users_projects` (
	`id` BINARY(16) NOT NULL,
	`user_id` BINARY(16) NOT NULL,
	`project_id` BINARY(16) NOT NULL,
	`role` VARCHAR(60) NOT NULL,
	PRIMARY KEY (id),
	FOREIGN KEY (user_id) REFERENCES users(id),
	FOREIGN KEY (project_id) REFERENCES projects(id)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `columns` (
	`id` BINARY(16) NOT NULL,
	`project_id` BINARY(16) NOT NULL,
	`title` VARCHAR(255) NOT NULL,
	`description` TEXT,
	PRIMARY KEY (id),
	FOREIGN KEY (project_id) REFERENCES projects(id)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `tasks` (
	`id` BINARY(16) NOT NULL,
	`column_id` BINARY(16) NOT NULL,
	`title` VARCHAR(255) NOT NULL,
	`description` TEXT,
	PRIMARY KEY (id),
	FOREIGN KEY (column_id) REFERENCES columns(id)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `labels` (
	`id` BINARY(16) NOT NULL,
	`title` VARCHAR(255) NOT NULL,
	`description` TEXT,
	PRIMARY KEY (id)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `tasks_labels` (
	`id` BINARY(16) NOT NULL,
	`task_id` BINARY(16) NOT NULL,
	`label_id` BINARY(16) NOT NULL,
	PRIMARY KEY (id),
	FOREIGN KEY (task_id) REFERENCES tasks(id),
	FOREIGN KEY (label_id) REFERENCES labels(id)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;