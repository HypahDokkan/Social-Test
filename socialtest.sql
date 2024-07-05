-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Creato il: Lug 05, 2024 alle 19:07
-- Versione del server: 10.4.32-MariaDB
-- Versione PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `socialtest`
--

-- --------------------------------------------------------

--
-- Struttura della tabella `posts`
--

CREATE TABLE `posts` (
  `postID` int(11) NOT NULL,
  `postAuthor` varchar(20) NOT NULL,
  `postText` varchar(400) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dump dei dati per la tabella `posts`
--

INSERT INTO `posts` (`postID`, `postAuthor`, `postText`) VALUES
(11, 'TeaLover900', 'Come visit my tea shop in Ba Sing Se!'),
(12, 'TeaLover900', 'Inner peace. :)'),
(13, 'TeaLover900', 'Hello!'),
(14, 'TeaLover900', 'Inner peace. :)'),
(21, 'Aang', 'Hello from the Avatar!'),
(22, 'Aang', 'Undercover in the Fire Nation :O');

-- --------------------------------------------------------

--
-- Struttura della tabella `users`
--

CREATE TABLE `users` (
  `username` varchar(20) NOT NULL,
  `password` varchar(64) NOT NULL,
  `name` varchar(15) DEFAULT NULL,
  `surname` varchar(15) DEFAULT NULL,
  `salt` varchar(16) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dump dei dati per la tabella `users`
--

INSERT INTO `users` (`username`, `password`, `name`, `surname`, `salt`) VALUES
('Aang', '0de2c5e3e1603cee7d1f9bdc115869360c9f04ade0ec076b0fd953aa3839f79d', 'Kuzan', 'Fire', 'HlD5yLyrh+n2qJqJ'),
('TeaLover900', '55495a32b95dd31ed58c8ff44bc55c4bfda2fd40949c7faf0df5398191fb1300', 'Iroh', '', 'VV2M0NiwfKWcw0NX'),
('Zuko', 'bfef80d2fb909f4bc239ea68ac11ada0b2250a860ac60c8bc5ff4194a4f7496e', 'Zuko', 'Fire', 'zFgoghIgXOfuku0h');

--
-- Indici per le tabelle scaricate
--

--
-- Indici per le tabelle `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`postID`),
  ADD KEY `posts` (`postAuthor`);

--
-- Indici per le tabelle `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`username`);

--
-- AUTO_INCREMENT per le tabelle scaricate
--

--
-- AUTO_INCREMENT per la tabella `posts`
--
ALTER TABLE `posts`
  MODIFY `postID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- Limiti per le tabelle scaricate
--

--
-- Limiti per la tabella `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `posts` FOREIGN KEY (`postAuthor`) REFERENCES `users` (`username`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
