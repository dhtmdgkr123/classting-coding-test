SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 데이터베이스: `classting_news`
--

DROP DATABASE IF EXISTS `classting_news`;
CREATE DATABASE IF NOT EXISTS `classting_news` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `classting_news`;

-- --------------------------------------------------------

--
-- 테이블 구조 `news`
--

CREATE TABLE `news` (
  `id` bigint UNSIGNED NOT NULL COMMENT '뉴스 ID',
  `school_id` bigint UNSIGNED NOT NULL COMMENT '뉴스를 발행한 학교 ID',
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '뉴스 내용',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '뉴스 발행 일 시',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '뉴스 내용 수정 일 시 ',
  `deleted_at` datetime DEFAULT NULL COMMENT '뉴스 삭제 일 시'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- 테이블 구조 `news_feeds`
--

CREATE TABLE `news_feeds` (
  `id` bigint UNSIGNED NOT NULL COMMENT '뉴스피드 ID',
  `news_id` bigint UNSIGNED NOT NULL COMMENT '뉴스피드에 노출될 뉴스 ID',
  `student_id` bigint UNSIGNED NOT NULL COMMENT '뉴스피드 소유주 학생 ID',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '뉴스피드 발행 일 시'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- 테이블 구조 `schools`
--

CREATE TABLE `schools` (
  `id` bigint UNSIGNED NOT NULL COMMENT '학교 ID',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '학교 이름',
  `region` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '학교 지역',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '학교 생성일 시',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '학교 정보 업데이트 일 시'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- 테이블 구조 `students`
--

CREATE TABLE `students` (
  `id` bigint UNSIGNED NOT NULL COMMENT '학생 ID',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '학생 이름',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '학생 정보 생성일 시 ',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '학생 정보 변경일 시 ',
  `deleted_at` datetime DEFAULT NULL COMMENT '학생 삭제일 시 '
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- 테이블 구조 `subscriptions`
--

CREATE TABLE `subscriptions` (
  `id` bigint UNSIGNED NOT NULL COMMENT '구독 ID',
  `student_id` bigint UNSIGNED NOT NULL COMMENT '학교 구독하는 학생 ID',
  `school_id` bigint UNSIGNED NOT NULL COMMENT '학생이 구독하는 학교 ID',
  `subscribe_at` datetime DEFAULT NULL COMMENT '구독 시작 일 시',
  `unsubscribe_at` datetime DEFAULT NULL COMMENT '구독 변경 일 시',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '데이터 생성 일 시',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '데이터 변경 일 시'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 덤프된 테이블의 인덱스
--

--
-- 테이블의 인덱스 `news`
--
ALTER TABLE `news`
  ADD PRIMARY KEY (`id`),
  ADD KEY `news_school_id_foreign` (`school_id`);

--
-- 테이블의 인덱스 `news_feeds`
--
ALTER TABLE `news_feeds`
  ADD PRIMARY KEY (`id`),
  ADD KEY `news_feeds_news_id_foreign` (`news_id`),
  ADD KEY `news_feeds_student_id_foreign` (`student_id`);

--
-- 테이블의 인덱스 `schools`
--
ALTER TABLE `schools`
  ADD PRIMARY KEY (`id`);

--
-- 테이블의 인덱스 `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`id`);

--
-- 테이블의 인덱스 `subscriptions`
--
ALTER TABLE `subscriptions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `subscriptions_student_id_foreign` (`student_id`),
  ADD KEY `subscriptions_school_id_foreign` (`school_id`);

--
-- 덤프된 테이블의 AUTO_INCREMENT
--

--
-- 테이블의 AUTO_INCREMENT `news`
--
ALTER TABLE `news`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '뉴스 ID';

--
-- 테이블의 AUTO_INCREMENT `news_feeds`
--
ALTER TABLE `news_feeds`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '뉴스피드 ID';

--
-- 테이블의 AUTO_INCREMENT `schools`
--
ALTER TABLE `schools`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '학교 ID';

--
-- 테이블의 AUTO_INCREMENT `students`
--
ALTER TABLE `students`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '학생 ID';

--
-- 테이블의 AUTO_INCREMENT `subscriptions`
--
ALTER TABLE `subscriptions`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '구독 ID';

--
-- 덤프된 테이블의 제약사항
--

--
-- 테이블의 제약사항 `news`
--
ALTER TABLE `news`
  ADD CONSTRAINT `news_school_id_foreign` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`);

--
-- 테이블의 제약사항 `news_feeds`
--
ALTER TABLE `news_feeds`
  ADD CONSTRAINT `news_feeds_news_id_foreign` FOREIGN KEY (`news_id`) REFERENCES `news` (`id`),
  ADD CONSTRAINT `news_feeds_student_id_foreign` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`);

--
-- 테이블의 제약사항 `subscriptions`
--
ALTER TABLE `subscriptions`
  ADD CONSTRAINT `subscriptions_school_id_foreign` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`),
  ADD CONSTRAINT `subscriptions_student_id_foreign` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
