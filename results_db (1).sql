-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 16, 2024 at 01:35 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `results_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `all_students`
--

CREATE TABLE `all_students` (
  `roll_number` varchar(15) NOT NULL,
  `student_name` text NOT NULL,
  `branch` varchar(10) NOT NULL,
  `joining_year` year(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `all_students`
--

INSERT INTO `all_students` (`roll_number`, `student_name`, `branch`, `joining_year`) VALUES
('20KA1A00172', 'Doctor Strange', 'MCU', '2020'),
('20KA1A004572', 'Naan Sirithaal', 'HHT', '2020'),
('20KA1A0072', 'TONY Stark', 'MCU', '2020'),
('20KA1A01072', 'Okkadu', 'ECE', '2020'),
('20KA1A0172', 'Bruce Banner', 'MCU', '2020'),
('20KA1A0182', 'Rama Rao', 'CIVIL', '2020'),
('20KA1A0272', 'Peter Parker', 'ECE', '2020'),
('20KA1A033072', 'Peter Quill', 'MCU', '2020'),
('20KA1A0472', 'Abdul Mateen', 'ECE', '2020'),
('20KA1A0513', 'K. Lokesh', 'CSE', '2020'),
('20KA1A0523', 'L. Bharath', 'CSE', '2020'),
('20KA1A0525', 'V. M. Vishnu', 'CSE', '2020'),
('20KA1A0526', 'T. S. Nithin', 'CSE', '2020'),
('20KA1A0527', 'M. Abninav', 'CSE', '2020'),
('20KA1A0540', 'Nikki', 'CSE', '2020'),
('20KA1A0572', 'BackLog Bhargav', 'CSE', '2017'),
('20KA1A0592', 'Ethan Hunt', 'CSE', '2020'),
('20KA1A05965', 'MadMax', 'MAT', '2019'),
('20KA1A05K0', 'Abdul Mateen', 'ECE', '2020'),
('20KA1A0872', 'Kabali', 'MCE', '2020'),
('20KA1A0972', 'Jawaan', 'ECE', '2023'),
('20KA1A0alk072', 'Gamora', 'MCU', '2020'),
('20KA1A0dd072', 'Rocket', 'MCU', '2020'),
('20KA1Aaa0072', 'Groot ', 'MCU', '2020'),
('20KA5A05102', 'Jack Reacher', 'CSE', '2021');

-- --------------------------------------------------------

--
-- Table structure for table `regulations`
--

CREATE TABLE `regulations` (
  `id` int(11) NOT NULL,
  `academic_year` int(11) NOT NULL,
  `academic_sem` int(11) NOT NULL,
  `regulation` varchar(5) NOT NULL,
  `reg_or_sup` int(1) NOT NULL,
  `results_date` date NOT NULL,
  `exam_month` varchar(30) NOT NULL,
  `exam_year` year(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `regulations`
--

INSERT INTO `regulations` (`id`, `academic_year`, `academic_sem`, `regulation`, `reg_or_sup`, `results_date`, `exam_month`, `exam_year`) VALUES
(1, 1, 1, 'R20', 1, '2024-01-31', 'August/September', '2020'),
(2, 1, 2, 'R20', 1, '2024-01-31', 'August/September', '2021'),
(3, 2, 1, 'R20', 1, '2024-01-31', 'August/September', '2022'),
(4, 2, 2, 'R20', 1, '2024-02-01', 'May/July', '2023'),
(5, 1, 1, 'R20', 1, '2024-01-31', 'November/December', '2020'),
(6, 3, 1, 'R20', 1, '2024-02-13', 'August/September', '2023'),
(7, 3, 2, 'R20', 1, '2024-02-13', 'August/September', '2023'),
(8, 4, 1, 'R20', 1, '2024-02-13', 'August/September', '2023'),
(9, 4, 2, 'R20', 1, '2024-02-13', 'August/September', '2023'),
(10, 3, 1, 'R20', 1, '2024-02-10', 'September', '2023'),
(11, 1, 2, 'R20', 1, '2024-02-12', 'September', '2019'),
(12, 1, 1, 'R20', 0, '2024-02-12', 'September', '2019'),
(13, 1, 1, 'R20', 0, '2024-02-12', 'September', '2019'),
(14, 2, 2, 'R20', 1, '2024-02-12', 'September', '2019'),
(15, 3, 1, 'R20', 1, '2024-02-12', 'September', '2019'),
(16, 3, 2, 'R20', 1, '2024-02-12', 'September', '2019'),
(17, 1, 2, 'R20', 0, '2024-02-12', 'September', '2019'),
(18, 4, 1, 'R20', 1, '2024-02-12', 'September', '2019'),
(20, 4, 2, 'R20', 1, '2024-02-12', 'September', '2019'),
(21, 1, 1, 'R20', 0, '2024-01-31', 'August/September', '2023');

-- --------------------------------------------------------

--
-- Table structure for table `results`
--

CREATE TABLE `results` (
  `id` int(11) NOT NULL,
  `subject_code` varchar(20) NOT NULL,
  `subject_name` varchar(50) NOT NULL,
  `internal_marks` int(11) NOT NULL,
  `external_marks` int(11) NOT NULL,
  `total_marks` int(11) NOT NULL,
  `grade` varchar(1) NOT NULL,
  `credits` float NOT NULL,
  `pass_or_fail` text DEFAULT NULL,
  `roll_number` text DEFAULT NULL,
  `regulation_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `results`
--

INSERT INTO `results` (`id`, `subject_code`, `subject_name`, `internal_marks`, `external_marks`, `total_marks`, `grade`, `credits`, `pass_or_fail`, `roll_number`, `regulation_id`) VALUES
(1, '20A07334', 'Computer Networks', 25, 61, 86, 'A', 3, 'PASS', '20KA1A0523', 1),
(2, '20A07331', 'Artificial Intelligence', 25, 47, 72, 'B', 1.5, 'PASS', '20KA1A0523', 1),
(3, '20A07329', 'MACHINE LEARNING', 27, 54, 81, 'A', 3, 'PASS', '20KA1A0523', 1),
(5, '20A09A3006', 'Advanced Data Structures & Algorithms Lab', 25, 64, 89, 'A', 1.5, 'PASS', '20KA1A0523', 1),
(6, '20A073036', 'Java Programming Lab', 25, 65, 90, 'S', 1.5, 'PASS', '20KA1A0523', 1),
(7, '20A0A7098', 'Python Programming Lab', 25, 65, 90, 'S', 1.5, 'PASS', '20KA1A0523', 1),
(8, '20A07336', 'Discrete Mathematics & Graph Theory', 25, 65, 90, 'S', 3, 'PASS', '20KA1A0523', 1),
(9, '20A07A436', 'Compiler Design Lab', 27, 67, 94, 'S', 1.5, 'PASS', '20KA1A0523', 1),
(10, '20A07336', 'Discrete Mathematics & Graph Theory', 25, 65, 90, 'S', 3, 'PASS', '20KA1A0526', 1),
(11, '20A07A436', 'Compiler Design Lab', 27, 67, 94, 'S', 1.5, 'PASS', '20KA1A0526', 1),
(12, '20A09A3006', 'Advanced Data Structures & Algorithms Lab', 25, 64, 89, 'A', 1.5, 'PASS', '20KA1A0526', 1),
(13, '20A073036', 'Java Programming Lab', 25, 65, 90, 'S', 1.5, 'PASS', '20KA1A0526', 1),
(14, '20A0A7098', 'Python Programming Lab', 25, 65, 90, 'S', 1.5, 'PASS', '20KA1A0526', 1),
(15, '20A0A7098', 'Cloud Computing', 25, 65, 90, 'S', 3, 'PASS', '20KA1A0526', 1),
(16, '20A0A7098', 'Human Values', 25, 0, 25, 'Y', 0, 'NILL', '20KA1A0526', 1),
(17, '20A07336', 'Discrete Mathematics & Graph Theory', 25, 65, 90, 'S', 3, 'PASS', '20KA1A05k0', 3),
(19, '20A0A7098', 'Human Values', 25, 0, 25, 'Y', 0, 'NILL', '20KA1A05K0', 3),
(20, '20A07A436', 'Compiler Design Lab', 27, 67, 94, 'S', 1.5, 'PASS', '20KA1A05K0', 3),
(21, '20A09A3006', 'Advanced Data Structures & Algorithms Lab', 25, 64, 89, 'A', 1.5, 'PASS', '20KA1A05K0', 3),
(22, '20A073036', 'Java Programming Lab', 25, 15, 40, 'F', 1.5, 'FAIL', '20KA1A05k0', 3),
(23, '20A0A7098', 'Python Programming Lab', 25, 65, 90, 'S', 1.5, 'PASS', '20KA1A05K0', 3),
(26, '20A0A7098', 'ADSA', 25, 35, 60, 'D', 3, 'PASS', '20KA1A0572', 5),
(27, '20A07A436', 'Compiler Design Lab', 27, 67, 94, 'S', 1.5, 'PASS', '20KA1A0572', 5),
(28, '20A09A3006', 'Advanced Data Structures & Algorithms Lab', 25, 15, 40, 'A', 1.5, 'FAIL', '20KA1A0572', 5),
(29, '20A073036', 'Java Programming Lab', 25, 65, 90, 'S', 1.5, 'PASS', '20KA1A0572', 5),
(30, '20A0A7098', 'Python Programming Lab', 25, 65, 90, 'S', 1.5, 'PASS', '20KA1A0572', 5),
(31, '20A07336', 'Discrete Mathematics & Graph Theory', 25, 15, 40, 'F', 3, 'FAIL', '20KA1A0572', 5),
(32, '20A07334', 'Artificial Intelligence', 25, 61, 86, 'A', 3.5, 'PASS', '20KA1A0526', 2),
(33, '20A07329', 'Machine Learning', 27, 54, 81, 'A', 3, 'PASS', '20KA1A0526', 2),
(34, '20A07334', 'Operating Systems', 25, 61, 86, 'A', 3.5, 'PASS', '20KA1A0526', 2),
(35, '20A07329', 'Database Management Systems', 27, 54, 81, 'A', 3, 'PASS', '20KA1A0526', 2),
(36, '20A07334', 'Advanced Web Application Development', 25, 61, 86, 'A', 3.5, 'PASS', '20KA1A0526', 2),
(37, '20A07329', 'Engineering  Workshop', 27, 54, 81, 'A', 3, 'PASS', '20KA1A0526', 2),
(38, '20A07334', 'Operating Systems', 25, 61, 86, 'A', 3.5, 'PASS', '20KA1A0526', 3),
(39, '20A07329', 'Database Management Systems', 27, 54, 81, 'A', 3, 'PASS', '20KA1A0526', 3),
(40, '20A07334', 'Advanced Web Application Development', 25, 61, 86, 'A', 3.5, 'PASS', '20KA1A0526', 3),
(41, '20A07329', 'IT  Workshop', 27, 54, 81, 'A', 3, 'PASS', '20KA1A0526', 3),
(42, '20A07329', 'IT  Workshop', 27, 54, 81, 'A', 3, 'PASS', '20KA1A0526', 4),
(43, '20A07329', 'IT  Workshop', 27, 54, 81, 'A', 3, 'PASS', '20KA1A0526', 4),
(44, '20A07329', 'IT  Workshop', 27, 54, 81, 'A', 3, 'PASS', '20KA1A0526', 4),
(45, '20A07329', 'IT  Workshop', 27, 54, 81, 'A', 3, 'PASS', '20KA1A0526', 4),
(46, '20A07329', 'IT  Workshop', 27, 54, 81, 'A', 3, 'PASS', '20KA1A0526', 4),
(47, '20A07329', 'IT  Workshop', 27, 54, 81, 'A', 3, 'PASS', '20KA1A0526', 4),
(48, '20A07329', 'IT  Workshop', 27, 54, 81, 'A', 3, 'PASS', '20KA1A0526', 4),
(49, '20A07329', 'Deterministic and Stocastic Statistical Measures', 27, 54, 81, 'A', 3, 'PASS', '20KA1A0526', 10),
(50, '20A07329', 'IT  Workshop', 27, 54, 81, 'A', 3, 'PASS', '20KA1A0526', 10),
(51, '20A07329', 'IT  Workshop', 27, 54, 81, 'A', 3, 'PASS', '20KA1A0526', 10),
(52, '20A07329', 'IT  Workshop', 27, 54, 81, 'A', 3, 'PASS', '20KA1A0526', 10),
(53, '20A07329', 'IT  Workshop', 27, 54, 81, 'A', 3, 'PASS', '20KA1A0526', 10),
(54, '20A07329', 'IT  Workshop', 27, 54, 81, 'A', 3, 'PASS', '20KA1A0526', 10),
(55, '20A07329', 'IT  Workshop', 27, 54, 81, 'A', 3, 'PASS', '20KA1A0526', 10),
(56, '20A07329', 'IT  Workshop', 27, 54, 81, 'A', 3, 'PASS', '20KA1A0526', 10),
(57, '20A07329', 'Deterministic and Stocastic Statistical Measures', 27, 54, 81, 'A', 3, 'PASS', '20KA1A0526', 10),
(58, '20A07329', 'IT  Workshop', 27, 54, 81, 'A', 3, 'PASS', '20KA1A0526', 7),
(59, '20A07329', 'IT  Workshop', 27, 54, 81, 'A', 3, 'PASS', '20KA1A0526', 7),
(60, '20A07329', 'IT  Workshop', 27, 54, 81, 'A', 3, 'PASS', '20KA1A0526', 7),
(61, '20A07329', 'IT  Workshop', 27, 54, 81, 'A', 3, 'PASS', '20KA1A0526', 7),
(62, '20A07329', 'IT  Workshop', 27, 54, 81, 'A', 3, 'PASS', '20KA1A0526', 7),
(63, '20A07329', 'IT  Workshop', 27, 54, 81, 'A', 3, 'PASS', '20KA1A0526', 7),
(64, '20A07329', 'Community Service Project', 27, 54, 81, 'A', 3, 'PASS', '20KA1A0526', 7),
(65, '20A07329', 'Deterministic and Stocastic Statistical Measures', 27, 54, 81, 'A', 3, 'PASS', '20KA1A0526', 7),
(66, '20A07329', 'Community Service Project', 27, 54, 81, 'A', 3, 'PASS', '20KA1A0526', 8),
(67, '20A07329', 'Deterministic and Stocastic Statistical Measures', 27, 54, 81, 'A', 3, 'PASS', '20KA1A0526', 7),
(68, '20A07329', 'Final year Project', 27, 54, 81, 'A', 3, 'PASS', '20KA1A0526', 9),
(69, '20A07334', 'Cryptography and Network Security', 25, 61, 86, 'A', 3.5, 'PASS', '20KA1A0526', 3),
(70, '20A07329', 'Engineering  Workshop', 27, 54, 81, 'A', 3, 'PASS', '20KA1A0526', 3),
(71, '20A9901D', 'APPLIED PHYSICS', 25, 65, 90, 'S', 3, 'PASS', '20KA1A0272', 10),
(72, '20A9901D', 'Data Structures', 26, 65, 91, 's', 3, 'PASS', '20KA1A0272', 10),
(73, '20A9901D', 'Data Science', 27, 65, 92, 'S', 3, 'PASS', '20KA1A0272', 10),
(74, '20A9901D', 'Deep Learning', 25, 65, 90, 'S', 3, 'PASS', '20KA1A0272', 10),
(75, '20A9901D', 'Matrices', 25, 65, 90, 'S', 3, 'PASS', '20KA1A0272', 10),
(76, '20A9901D', 'Integral Calculus', 28, 65, 93, 'S', 3, 'PASS', '20KA1A0272', 10),
(77, '20A9901D', 'Chemistry', 22, 65, 87, 'A', 3, 'PASS', '20KA1A0272', 10),
(78, '20A9901D', 'Robotics', 29, 65, 94, 'S', 3, 'PASS', '20KA1A0272', 10),
(79, '20A9901D', '3D Printing', 24, 65, 89, 'A', 3, 'PASS', '20KA1A0272', 10),
(80, '20A9901D', 'APPLIED PHYSICS', 25, 15, 40, 'F', 3, 'FAIL', '20KA1A0572', 11),
(85, '20A9901D', 'Integral Calculus', 28, 65, 93, 'S', 3, 'PASS', '20KA1A0572', 11),
(86, '20A9901D', 'Chemistry', 22, 65, 87, 'A', 3, 'PASS', '20KA1A0572', 11),
(87, '20A9901D', 'Robotics', 29, 65, 94, 'S', 3, 'PASS', '20KA1A0572', 11),
(88, '20A9901D', '3D Printing', 24, 65, 89, 'A', 3, 'PASS', '20KA1A0572', 11),
(89, '20A07336', 'DISCRETE MATHEMATICS & GRAPH THEORY', 25, 65, 90, 'S', 3, 'PASS', '20KA1A0572', 13),
(90, '20A9901D', 'APPLIED PHYSICS', 25, 65, 90, 'S', 3, 'PASS', '20KA1A0572', 14),
(91, '20A9901D', 'Data Structures', 26, 65, 91, 'S', 3, 'PASS', '20KA1A0572', 14),
(92, '20A9901D', 'Data Science', 27, 65, 92, 'S', 3, 'PASS', '20KA1A0572', 14),
(93, '20A9901D', 'Deep Learning', 25, 65, 90, 'S', 3, 'PASS', '20KA1A0572', 14),
(94, '20A9901D', 'Matrices', 25, 65, 90, 'S', 3, 'PASS', '20KA1A0572', 14),
(95, '20A9901D', 'Integral Calculus', 28, 65, 93, 'S', 3, 'PASS', '20KA1A0572', 14),
(96, '20A9901D', 'Chemistry', 22, 65, 87, 'S', 3, 'PASS', '20KA1A0572', 14),
(97, '20A9901D', 'Robotics', 29, 65, 94, 'S', 3, 'PASS', '20KA1A0572', 14),
(98, '20A9901D', '3D Printing', 24, 65, 89, 'S', 3, 'PASS', '20KA1A0572', 14),
(99, '20A9901D', 'APPLIED PHYSICS', 25, 65, 90, 'S', 3, 'PASS', '20KA1A0572', 15),
(100, '20A9901D', 'Data Structures', 26, 65, 91, 'S', 3, 'PASS', '20KA1A0572', 15),
(101, '20A9901D', 'Data Science', 27, 65, 92, 'S', 3, 'PASS', '20KA1A0572', 15),
(102, '20A9901D', 'Deep Learning', 25, 65, 90, 'S', 3, 'PASS', '20KA1A0572', 15),
(103, '20A9901D', 'Matrices', 25, 65, 90, 'S', 3, 'PASS', '20KA1A0572', 15),
(104, '20A9901D', 'Integral Calculus', 28, 65, 93, 'S', 3, 'PASS', '20KA1A0572', 15),
(105, '20A9901D', 'Chemistry', 22, 65, 87, 'S', 3, 'PASS', '20KA1A0572', 15),
(106, '20A9901D', 'Robotics', 29, 65, 94, 'S', 3, 'PASS', '20KA1A0572', 15),
(107, '20A9901D', '3D Printing', 24, 65, 89, 'S', 3, 'PASS', '20KA1A0572', 15),
(108, '20A9901D', 'APPLIED PHYSICS', 25, 65, 90, 'S', 3, 'PASS', '20KA1A0572', 16),
(109, '20A9901D', 'Data Structures', 26, 65, 91, 'S', 3, 'PASS', '20KA1A0572', 16),
(110, '20A9901D', 'Data Science', 27, 65, 92, 'S', 3, 'PASS', '20KA1A0572', 16),
(111, '20A9901D', 'Deep Learning', 25, 65, 90, 'S', 3, 'PASS', '20KA1A0572', 16),
(112, '20A9901D', 'Matrices', 25, 65, 90, 'S', 3, 'PASS', '20KA1A0572', 16),
(113, '20A9901D', 'Integral Calculus', 28, 65, 93, 'S', 3, 'PASS', '20KA1A0572', 16),
(114, '20A9901D', 'Chemistry', 22, 65, 87, 'S', 3, 'PASS', '20KA1A0572', 16),
(115, '20A9901D', 'Robotics', 29, 65, 94, 'S', 3, 'PASS', '20KA1A0572', 16),
(116, '20A9901D', '3D Printing', 24, 65, 89, 'S', 3, 'PASS', '20KA1A0572', 16),
(117, '20A9901D', 'APPLIED PHYSICS', 25, 65, 90, 'S', 3, 'PASS', '20KA1A0572', 17),
(126, '20A9901D', 'APPLIED PHYSICS', 25, 65, 90, 'S', 3, 'PASS', '20KA1A0572', 18),
(127, '20A9901D', 'Data Structures', 26, 65, 91, 'S', 3, 'PASS', '20KA1A0573', 18),
(128, '20A9901D', 'Data Science', 27, 65, 92, 'S', 3, 'PASS', '20KA1A0574', 18),
(129, '20A9901D', 'Deep Learning', 25, 65, 90, 'S', 3, 'PASS', '20KA1A0575', 18),
(130, '20A9901D', 'Matrices', 25, 65, 90, 'S', 3, 'PASS', '20KA1A0576', 18),
(131, '20A9901D', 'Integral Calculus', 28, 65, 93, 'S', 3, 'PASS', '20KA1A0577', 18),
(132, '20A9901D', 'Chemistry', 22, 65, 87, 'A', 3, 'PASS', '20KA1A0578', 18),
(133, '20A9901D', 'Robotics', 29, 65, 94, 'S', 3, 'PASS', '20KA1A0579', 18),
(134, '20A9901D', '3D Printing', 24, 65, 89, 'A', 3, 'PASS', '20KA1A0580', 18),
(144, '20A9901D', 'APPLIED PHYSICS', 25, 65, 90, 'S', 3, 'PASS', '20KA1A0572', 20),
(145, '20A9901D', 'Data Structures', 26, 65, 91, 'S', 3, 'PASS', '20KA1A0573', 20),
(146, '20A9901D', 'Data Science', 27, 65, 92, 'S', 3, 'PASS', '20KA1A0574', 20),
(147, '20A9901D', 'Deep Learning', 25, 65, 90, 'S', 3, 'PASS', '20KA1A0575', 20),
(148, '20A9901D', 'Matrices', 25, 65, 90, 'S', 3, 'PASS', '20KA1A0576', 20),
(149, '20A9901D', 'Integral Calculus', 28, 65, 93, 'S', 3, 'PASS', '20KA1A0577', 20),
(150, '20A9901D', 'Chemistry', 22, 65, 87, 'A', 3, 'PASS', '20KA1A0578', 20),
(151, '20A9901D', 'Robotics', 29, 65, 94, 'S', 3, 'PASS', '20KA1A0579', 20),
(152, '20A9901D', '3D Printing', 24, 14, 38, 'A', 3, 'FAIL', '20KA1A0580', 20),
(153, '20A07336', 'Advanced Data Structures and Algorithms', 25, 61, 86, 'A', 3.5, 'PASS', '20KA1A0572', 21);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `all_students`
--
ALTER TABLE `all_students`
  ADD PRIMARY KEY (`roll_number`);

--
-- Indexes for table `regulations`
--
ALTER TABLE `regulations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `results`
--
ALTER TABLE `results`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `regulations`
--
ALTER TABLE `regulations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `results`
--
ALTER TABLE `results`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=154;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
