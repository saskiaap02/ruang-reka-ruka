-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 16, 2026 at 01:22 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ruka_data`
--

-- --------------------------------------------------------

--
-- Table structure for table `activity_logs`
--

CREATE TABLE `activity_logs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `group_id` bigint(20) UNSIGNED NOT NULL,
  `task_id` bigint(20) UNSIGNED DEFAULT NULL,
  `action_type` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `activity_logs`
--

INSERT INTO `activity_logs` (`id`, `user_id`, `group_id`, `task_id`, `action_type`, `description`, `created_at`, `updated_at`) VALUES
(1, 2, 1, NULL, 'Update Logbook', 'Mengerjakan tugas ke-1', '2026-04-15 06:18:13', NULL),
(2, 2, 2, NULL, 'Update Logbook', 'Mengerjakan tugas ke-2', '2026-04-15 06:18:13', NULL),
(3, 2, 3, NULL, 'Update Logbook', 'Mengerjakan tugas ke-3', '2026-04-11 06:18:13', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cache`
--

INSERT INTO `cache` (`key`, `value`, `expiration`) VALUES
('laravel-cache-feli0102@gmail.com|127.0.0.1', 'i:1;', 1776259281),
('laravel-cache-feli0102@gmail.com|127.0.0.1:timer', 'i:1776259281;', 1776259281);

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `class_students`
--

CREATE TABLE `class_students` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `project_class_id` bigint(20) UNSIGNED NOT NULL,
  `student_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `class_students`
--

INSERT INTO `class_students` (`id`, `project_class_id`, `student_id`, `created_at`, `updated_at`) VALUES
(1, 1, 2, '2026-04-15 06:18:13', NULL),
(2, 2, 3, '2026-04-15 06:24:00', '2026-04-15 06:24:00');

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `groups`
--

CREATE TABLE `groups` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `project_class_id` bigint(20) UNSIGNED NOT NULL,
  `nama_kelompok` varchar(255) NOT NULL,
  `project_title` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `groups`
--

INSERT INTO `groups` (`id`, `project_class_id`, `nama_kelompok`, `project_title`, `created_at`, `updated_at`) VALUES
(1, 1, 'Kelompok 1', 'Sistem Kasir Toko', '2026-04-15 06:18:13', NULL),
(2, 1, 'Kelompok 2', 'Aplikasi Soft-Skill', '2026-04-15 06:18:13', NULL),
(3, 1, 'Kelompok 3', 'AERO-SHIELD Drone', '2026-04-15 06:18:13', NULL),
(4, 2, 'TIM 1', NULL, '2026-04-15 06:24:29', '2026-04-15 06:24:29');

-- --------------------------------------------------------

--
-- Table structure for table `group_members`
--

CREATE TABLE `group_members` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `group_id` bigint(20) UNSIGNED NOT NULL,
  `student_id` bigint(20) UNSIGNED NOT NULL,
  `nilai_audit` decimal(5,2) NOT NULL DEFAULT 0.00,
  `nilai_akhir` decimal(5,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `group_members`
--

INSERT INTO `group_members` (`id`, `group_id`, `student_id`, `nilai_audit`, `nilai_akhir`, `created_at`, `updated_at`) VALUES
(1, 1, 2, 0.00, 90.00, '2026-04-15 06:18:13', NULL),
(2, 2, 2, 0.00, 75.00, '2026-04-15 06:18:13', NULL),
(3, 3, 2, 0.00, 50.00, '2026-04-15 06:18:13', NULL),
(4, 4, 3, 0.00, NULL, '2026-04-15 06:24:40', '2026-04-15 06:24:40');

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2026_04_06_234014_create_sim_cr_tables', 1),
(5, '2026_04_09_020131_create_nudges_table', 1),
(6, '2026_04_12_172201_add_audit_columns_to_group_members_table', 1);

-- --------------------------------------------------------

--
-- Table structure for table `nudges`
--

CREATE TABLE `nudges` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `dosen_id` bigint(20) UNSIGNED NOT NULL,
  `student_id` bigint(20) UNSIGNED NOT NULL,
  `group_id` bigint(20) UNSIGNED NOT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `nudges`
--

INSERT INTO `nudges` (`id`, `dosen_id`, `student_id`, `group_id`, `message`, `created_at`, `updated_at`) VALUES
(1, 4, 3, 4, 'Dosen memberikan peringatan karena kamu tidak aktif.', '2026-04-15 06:24:53', NULL),
(2, 4, 3, 4, 'Dosen memberikan peringatan karena kamu tidak aktif.', '2026-04-15 06:27:18', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `peer_reviews`
--

CREATE TABLE `peer_reviews` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `reviewer_id` bigint(20) UNSIGNED NOT NULL,
  `reviewee_id` bigint(20) UNSIGNED NOT NULL,
  `group_id` bigint(20) UNSIGNED NOT NULL,
  `score` int(11) NOT NULL,
  `feedback_text` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `project_classes`
--

CREATE TABLE `project_classes` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `dosen_id` bigint(20) UNSIGNED NOT NULL,
  `mata_kuliah` varchar(255) NOT NULL,
  `nama_kelas` varchar(255) NOT NULL,
  `invite_code` varchar(6) NOT NULL,
  `bobot_dasar` int(11) NOT NULL DEFAULT 50,
  `bobot_audit` int(11) NOT NULL DEFAULT 30,
  `bobot_peer` int(11) NOT NULL DEFAULT 20,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `project_classes`
--

INSERT INTO `project_classes` (`id`, `dosen_id`, `mata_kuliah`, `nama_kelas`, `invite_code`, `bobot_dasar`, `bobot_audit`, `bobot_peer`, `created_at`, `updated_at`) VALUES
(1, 1, 'Pemrograman Web II', 'Sistem Informasi 4A', 'WEB4AX', 50, 30, 20, '2026-04-15 06:18:13', '2026-04-15 06:18:13'),
(2, 4, 'SI - dasar', 'SI 4A', 'ZZTNCD', 50, 30, 20, '2026-04-15 06:23:29', '2026-04-15 06:23:29'),
(3, 4, 'MULMED - 2', 'SI 4A', '5CRHSB', 50, 30, 20, '2026-04-15 06:26:35', '2026-04-15 06:26:35');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('6c9cPIQz2ful5uwUhfxqMcjf2m6fK3T5tZnBhAON', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36 Edg/147.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiYkVKWUNyaVRPQkRKYUNzTXlZSmNYZFU1QUNIaWN3RGZoV2RySjZ5NSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9fQ==', 1776260321);

-- --------------------------------------------------------

--
-- Table structure for table `tasks`
--

CREATE TABLE `tasks` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `group_id` bigint(20) UNSIGNED NOT NULL,
  `pic_id` bigint(20) UNSIGNED DEFAULT NULL,
  `judul` varchar(255) NOT NULL,
  `status` enum('backlog','in_progress','done') NOT NULL DEFAULT 'backlog',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tasks`
--

INSERT INTO `tasks` (`id`, `group_id`, `pic_id`, `judul`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, 2, 'Tugas 1 Kelompok 1', 'done', '2026-04-15 06:18:13', NULL),
(2, 1, 2, 'Tugas 2 Kelompok 1', 'done', '2026-04-15 06:18:13', NULL),
(3, 1, 2, 'Tugas 3 Kelompok 1', 'done', '2026-04-15 06:18:13', NULL),
(4, 1, 2, 'Tugas 4 Kelompok 1', 'backlog', '2026-04-15 06:18:13', NULL),
(5, 2, 2, 'Tugas 1 Kelompok 2', 'done', '2026-04-15 06:18:13', NULL),
(6, 2, 2, 'Tugas 2 Kelompok 2', 'done', '2026-04-15 06:18:13', NULL),
(7, 2, 2, 'Tugas 3 Kelompok 2', 'backlog', '2026-04-15 06:18:13', NULL),
(8, 2, 2, 'Tugas 4 Kelompok 2', 'backlog', '2026-04-15 06:18:13', NULL),
(9, 2, 2, 'Tugas 5 Kelompok 2', 'backlog', '2026-04-15 06:18:13', NULL),
(10, 3, 2, 'Tugas 1 Kelompok 3', 'backlog', '2026-04-15 06:18:13', NULL),
(11, 3, 2, 'Tugas 2 Kelompok 3', 'backlog', '2026-04-15 06:18:13', NULL),
(12, 3, 2, 'Tugas 3 Kelompok 3', 'backlog', '2026-04-15 06:18:13', NULL),
(13, 3, 2, 'Tugas 4 Kelompok 3', 'backlog', '2026-04-15 06:18:13', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nim_nip` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `role` enum('dosen','mahasiswa') NOT NULL DEFAULT 'mahasiswa',
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `nim_nip`, `name`, `email`, `role`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, '198001012005011001', 'Saskia (Dosen)', 'dosen@sim.com', 'dosen', NULL, '$2y$12$4Q9FwSwkANnnKx1PoRQO3O7jvnFuIbyk61cnD7rgsk1xwZqQzRtLS', NULL, '2026-04-15 06:18:13', '2026-04-15 06:18:13'),
(2, '09031282227000', 'Budi Mahasiswa', 'budi@sim.com', 'mahasiswa', NULL, '$2y$12$EbwcKEhwUYd3XjDsFt3eRenVmWHDZ/0jFb2wPWTYI88DOWxHUb85.', NULL, '2026-04-15 06:18:13', '2026-04-15 06:18:13'),
(3, '12345678', 'Himara', 'hilmara0102@gmail.com', 'mahasiswa', NULL, '$2y$12$SGwva3fpWP52rVtuHSHXRu9sHCcDnUkGDY5Zh.gsWVULBZ7Se8SyK', NULL, '2026-04-15 06:22:32', '2026-04-15 06:22:32'),
(4, '567890', 'mara', 'mara0102@gmail.com', 'dosen', NULL, '$2y$12$mNEv4al0X3Nh4UstFJ7mA.Hjblqv5G6RRBiTi0pHvIsZcQdpJJFKS', NULL, '2026-04-15 06:23:08', '2026-04-15 06:23:08');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `activity_logs_user_id_foreign` (`user_id`),
  ADD KEY `activity_logs_group_id_foreign` (`group_id`),
  ADD KEY `activity_logs_task_id_foreign` (`task_id`);

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_expiration_index` (`expiration`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_locks_expiration_index` (`expiration`);

--
-- Indexes for table `class_students`
--
ALTER TABLE `class_students`
  ADD PRIMARY KEY (`id`),
  ADD KEY `class_students_project_class_id_foreign` (`project_class_id`),
  ADD KEY `class_students_student_id_foreign` (`student_id`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `groups`
--
ALTER TABLE `groups`
  ADD PRIMARY KEY (`id`),
  ADD KEY `groups_project_class_id_foreign` (`project_class_id`);

--
-- Indexes for table `group_members`
--
ALTER TABLE `group_members`
  ADD PRIMARY KEY (`id`),
  ADD KEY `group_members_group_id_foreign` (`group_id`),
  ADD KEY `group_members_student_id_foreign` (`student_id`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `nudges`
--
ALTER TABLE `nudges`
  ADD PRIMARY KEY (`id`),
  ADD KEY `nudges_dosen_id_foreign` (`dosen_id`),
  ADD KEY `nudges_student_id_foreign` (`student_id`),
  ADD KEY `nudges_group_id_foreign` (`group_id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `peer_reviews`
--
ALTER TABLE `peer_reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `peer_reviews_reviewer_id_foreign` (`reviewer_id`),
  ADD KEY `peer_reviews_reviewee_id_foreign` (`reviewee_id`),
  ADD KEY `peer_reviews_group_id_foreign` (`group_id`);

--
-- Indexes for table `project_classes`
--
ALTER TABLE `project_classes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `project_classes_invite_code_unique` (`invite_code`),
  ADD KEY `project_classes_dosen_id_foreign` (`dosen_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `tasks`
--
ALTER TABLE `tasks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tasks_group_id_foreign` (`group_id`),
  ADD KEY `tasks_pic_id_foreign` (`pic_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_nim_nip_unique` (`nim_nip`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activity_logs`
--
ALTER TABLE `activity_logs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `class_students`
--
ALTER TABLE `class_students`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `groups`
--
ALTER TABLE `groups`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `group_members`
--
ALTER TABLE `group_members`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `nudges`
--
ALTER TABLE `nudges`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `peer_reviews`
--
ALTER TABLE `peer_reviews`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `project_classes`
--
ALTER TABLE `project_classes`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tasks`
--
ALTER TABLE `tasks`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD CONSTRAINT `activity_logs_group_id_foreign` FOREIGN KEY (`group_id`) REFERENCES `groups` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `activity_logs_task_id_foreign` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `activity_logs_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `class_students`
--
ALTER TABLE `class_students`
  ADD CONSTRAINT `class_students_project_class_id_foreign` FOREIGN KEY (`project_class_id`) REFERENCES `project_classes` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `class_students_student_id_foreign` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `groups`
--
ALTER TABLE `groups`
  ADD CONSTRAINT `groups_project_class_id_foreign` FOREIGN KEY (`project_class_id`) REFERENCES `project_classes` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `group_members`
--
ALTER TABLE `group_members`
  ADD CONSTRAINT `group_members_group_id_foreign` FOREIGN KEY (`group_id`) REFERENCES `groups` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `group_members_student_id_foreign` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `nudges`
--
ALTER TABLE `nudges`
  ADD CONSTRAINT `nudges_dosen_id_foreign` FOREIGN KEY (`dosen_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `nudges_group_id_foreign` FOREIGN KEY (`group_id`) REFERENCES `groups` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `nudges_student_id_foreign` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `peer_reviews`
--
ALTER TABLE `peer_reviews`
  ADD CONSTRAINT `peer_reviews_group_id_foreign` FOREIGN KEY (`group_id`) REFERENCES `groups` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `peer_reviews_reviewee_id_foreign` FOREIGN KEY (`reviewee_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `peer_reviews_reviewer_id_foreign` FOREIGN KEY (`reviewer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `project_classes`
--
ALTER TABLE `project_classes`
  ADD CONSTRAINT `project_classes_dosen_id_foreign` FOREIGN KEY (`dosen_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tasks`
--
ALTER TABLE `tasks`
  ADD CONSTRAINT `tasks_group_id_foreign` FOREIGN KEY (`group_id`) REFERENCES `groups` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `tasks_pic_id_foreign` FOREIGN KEY (`pic_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
