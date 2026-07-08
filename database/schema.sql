-- Legacy OS Database Schema

CREATE DATABASE IF NOT EXISTS legacy_os;
USE legacy_os;

-- Users Table
CREATE TABLE Users (
  id CHAR(36) PRIMARY KEY,
  fullName VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  profileImage VARCHAR(500),
  bio TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Photos Table
CREATE TABLE Photos (
  id CHAR(36) PRIMARY KEY,
  userId CHAR(36) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  url VARCHAR(500) NOT NULL,
  cloudinaryId VARCHAR(255),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE,
  INDEX idx_userId (userId),
  INDEX idx_createdAt (createdAt)
);

-- Videos Table
CREATE TABLE Videos (
  id CHAR(36) PRIMARY KEY,
  userId CHAR(36) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  url VARCHAR(500) NOT NULL,
  thumbnailUrl VARCHAR(500),
  cloudinaryId VARCHAR(255),
  duration INT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE,
  INDEX idx_userId (userId),
  INDEX idx_createdAt (createdAt)
);

-- Journals Table
CREATE TABLE Journals (
  id CHAR(36) PRIMARY KEY,
  userId CHAR(36) NOT NULL,
  title VARCHAR(255) NOT NULL,
  content LONGTEXT NOT NULL,
  mood VARCHAR(50) DEFAULT '😊',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE,
  INDEX idx_userId (userId),
  INDEX idx_createdAt (createdAt),
  FULLTEXT INDEX ft_title_content (title, content)
);

-- Milestones Table
CREATE TABLE Milestones (
  id CHAR(36) PRIMARY KEY,
  userId CHAR(36) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  category ENUM('Education', 'Career', 'Personal', 'Travel', 'Achievement') DEFAULT 'Achievement',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE,
  INDEX idx_userId (userId),
  INDEX idx_date (date)
);

-- Create indexes for better query performance
CREATE INDEX idx_users_email ON Users(email);
CREATE INDEX idx_photos_title ON Photos(title);
CREATE INDEX idx_videos_title ON Videos(title);
CREATE INDEX idx_journals_title ON Journals(title);
CREATE INDEX idx_milestones_category ON Milestones(category);
